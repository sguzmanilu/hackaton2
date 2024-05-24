import boto3

def get_characters():
    dynamo_client = boto3.client(
            'dynamodb',
            region_name='us-east-1'
        )
        
    response = dynamo_client.scan(
        TableName='personajes'
    )
    
    characters = response['Items']
    characters_list = []
    for character in characters:
        characters_list.append({
            'id': int(character['id']['N']),
            'name': character['name']['S'],
            'image': character['image']['S'],
            'minValue': int(character['minValue']['N']),
            'maxValue': int(character['maxValue']['N']),
        })
    
    return characters_list
