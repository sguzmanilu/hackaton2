import boto3
import pandas as pd

# def get_characters():
#     dynamo_client = boto3.client(
#             'dynamodb',
#             region_name='us-east-1'
#         )
        
#     response = dynamo_client.scan(
#         TableName='personajes'
#     )
    
#     characters = response['Items']
#     characters_list = []
#     for character in characters:
#         characters_list.append({
#             'id': int(character['id']['S']),
#             'name': character['name']['S'],
#             'image': character['image']['S'],
#             'minValue': int(character['minValue']['N']),
#             'maxValue': int(character['maxValue']['N']),
#         })
    
#     return characters_list

def get_characters():
    # Leer del csv local
    characters = pd.read_csv('utils/dragonball-characteres.csv')
    characters = characters.to_dict('records')
    characters_list = []
    for character in characters:
        characters_list.append({
            'id': int(character['id']),
            'name': character['name'],
            'image': character['image'],
            'minValue': int(character['minValue']),
            'maxValue': int(character['maxValue']),
        })
    
    return characters_list
