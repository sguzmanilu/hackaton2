SELECT * FROM dbo.TPersonaje

/* INCISO 1 */
SELECT
	race as Raza,
	COUNT(CASE WHEN gender = 'Male' THEN 1 ELSE NULL END) AS M,
    COUNT(CASE WHEN gender = 'Female' THEN 1 ELSE NULL END) AS F
FROM dbo.TPersonaje
GROUP BY race

/* INCISO 2 */

--- DROP Table #TempPersonajes

SELECT * INTO #TempPersonajes FROM dbo.TPersonaje;

SELECT * FROM #TempPersonajes;

UPDATE #TempPersonajes SET
	ki = REPLACE(REPLACE(ki, ' ', ''), ',', ''),
	maxKi = REPLACE(REPLACE(maxKi, ' ', ''), ',', '')
;
UPDATE #TempPersonajes SET ki = CASE
	WHEN ki LIKE '%Billion' THEN CAST(REPLACE(REPLACE(ki, 'billion', ''), 'Billion', '') AS float) * 1000000000
	WHEN ki LIKE '%Million' THEN CAST(REPLACE(REPLACE(ki, 'million', ''), 'Million', '') AS float) * 1000000
	WHEN ki LIKE '%Thousand' THEN CAST(REPLACE(REPLACE(ki, 'thousand', ''), 'Thousand', '') AS float) * 1000
	WHEN ki LIKE '%Trillion' THEN CAST(REPLACE(REPLACE(ki, 'trillion', ''), 'Trillion', '') AS float)			* 1000000000000
	WHEN ki LIKE '%Quadrillion' THEN CAST(REPLACE(REPLACE(ki, 'quadrillion', ''), 'Quadrillion', '') AS float)	* 1000000000000000
	WHEN ki LIKE '%Quintillion' THEN CAST(REPLACE(REPLACE(ki, 'quintillion', ''), 'Quintillion', '') AS float)	* 1000000000000000000
	WHEN ki LIKE '%Septillion' THEN CAST(REPLACE(REPLACE(ki, 'septillion', ''), 'Septillion', '') AS float)		* 1000000000000000000000000
	WHEN ki LIKE '%Googolplex' THEN CAST(1 AS float)
	WHEN ki LIKE '%unknown' THEN CAST(0 AS float)
	ELSE TRY_CAST(REPLACE(ki, '.', '') AS float)
END,
maxKi = CASE
	WHEN maxKi LIKE '%Billion' THEN CAST(REPLACE(REPLACE(maxKi, 'billion', ''), 'Billion', '') AS float) * 1000000000
	WHEN maxKi LIKE '%Million' THEN CAST(REPLACE(REPLACE(maxKi, 'million', ''), 'Million', '') AS float) * 1000000
	WHEN maxKi LIKE '%Thousand' THEN CAST(REPLACE(REPLACE(maxKi, 'thousand', ''), 'Thousand', '') AS float) * 1000
	WHEN maxKi LIKE '%Trillion' THEN CAST(REPLACE(REPLACE(maxKi, 'trillion', ''), 'Trillion', '') AS float)				* 1000000000000
	WHEN maxKi LIKE '%Quadrillion' THEN CAST(REPLACE(REPLACE(maxKi, 'quadrillion', ''), 'Quadrillion', '') AS float)	* 1000000000000000
	WHEN maxKi LIKE '%Quintillion' THEN CAST(REPLACE(REPLACE(maxKi, 'quintillion', ''), 'Quintillion', '') AS float)	* 1000000000000000000
	WHEN maxKi LIKE '%Sextillion' THEN CAST(REPLACE(REPLACE(maxKi, 'Sextillion', ''), 'Sextillion', '') AS float)		* 1000000000000000000000
	WHEN maxKi LIKE '%Septillion' THEN CAST(REPLACE(REPLACE(maxKi, 'septillion', ''), 'Septillion', '') AS float)		* 1000000000000000000000000
	WHEN maxKi LIKE '%Septllion' THEN CAST(REPLACE(REPLACE(maxKi, 'septllion', ''), 'Septllion', '') AS float)			* 1000000000000000000000000
	WHEN maxKi LIKE '%Googolplex' THEN CAST(1 AS float)
	WHEN maxKi LIKE '%unknown' THEN CAST(0 AS float)
	ELSE TRY_CAST(REPLACE(maxKi, '.', '') AS float)
END;

/* INCISO 3 */
SELECT name as Personaje, ki as Ki, maxKi as MaxKi, CAST(maxKi AS float) - CAST(ki AS float) as Brecha
FROM #TempPersonajes

/* INCISO 4 */
SELECT tp.race, tp.name, tp.maxKi
FROM #TempPersonajes tp
INNER JOIN (
    SELECT race, MAX(maxKi) AS MaxMaxKi
    FROM #TempPersonajes
    GROUP BY race
) tmax
ON tp.race = tmax.race AND tp.maxKi = tmax.MaxMaxKi
ORDER BY tp.race;

/* INCISO 5 */

SELECT TOP 1
	race as Raza, name as Nombre, maxKi
FROM #TempPersonajes
WHERE race = 'God'
ORDER BY maxKi ASC

/* INCISO 6 */

SELECT P1.name AS Nombre, COUNT(CASE WHEN CHARINDEX(P1.name, P2.description) > 0 THEN 1 END) AS Total
FROM #TempPersonajes P1 JOIN #TempPersonajes P2 ON CHARINDEX(P1.name, P2.description) > 0
GROUP BY P1.name;

/* INCISO 7 */
SELECT name AS NombreOriginal, REVERSE(name) AS NombreInvertido 
FROM #TempPersonajes;

/* INCISO 8 */
DECLARE @cols AS NVARCHAR(MAX);
DECLARE @query AS NVARCHAR(MAX);

-- Obtener las razas únicas
SET @cols = STUFF((SELECT DISTINCT ',' + QUOTENAME(race) 
            FROM #TempPersonajes
            FOR XML PATH(''), TYPE
            ).value('.', 'NVARCHAR(MAX)') 
        ,1,1,'');

SET @query = 
    'SELECT ' + @cols + ' 
    FROM (
        SELECT race, 
               PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY CAST(maxKi AS float)) OVER (PARTITION BY race) AS Mediana
        FROM #TempPersonajes
    ) AS SourceTable
    PIVOT(
        MAX(Mediana) FOR race IN (' + @cols + ')
    ) AS PivotTable';

EXEC(@query);

/* INCISO 9 */
WITH Repetitions AS (
    SELECT 
        name,
        LEN(name) - LEN(REPLACE(name, SUBSTRING(name, N, 1), '')) AS Repetidos,
        SUBSTRING(name, N, 1) AS CaracterRepetido
    FROM 
        #TempPersonajes
    CROSS JOIN 
        (VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10)) AS Numbers(N)
    WHERE 
        N <= LEN(name)
)

SELECT 
    name,
    Repetidos,
    STUFF((
        SELECT ', ' + CaracterRepetido
        FROM Repetitions R2
        WHERE R2.name = R1.name
        FOR XML PATH('')), 1, 2, '') AS DetalleRepetidos
FROM 
    Repetitions R1
WHERE 
    Repetidos > 0
ORDER BY 
    Repetidos DESC;

