from flask_restful import reqparse, abort, Resource
from flask_jwt_extended import jwt_required
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User

TODOS = {
    'todo1': {'task': 'build an API'},
    'todo2': {'task': '?????'},
    'todo3': {'task': 'profit!'},
}

def abort_if_todo_doesnt_exist(todo_id):
    if todo_id not in TODOS:
        abort(404, message="Todo {} doesn't exist".format(todo_id))

parser = reqparse.RequestParser()
parser.add_argument('task')

class TodoController(Resource):
    
    @jwt_required()
    def get(self, todo_id=None):
        user_id = get_jwt_identity()
        print('user_id ', user_id)
        if todo_id:
            abort_if_todo_doesnt_exist(todo_id)
            return TODOS[todo_id]
        else:
            return TODOS

    def delete(self, todo_id):
        abort_if_todo_doesnt_exist(todo_id)
        del TODOS[todo_id]
        return '', 204

    def put(self, todo_id):
        args = parser.parse_args()
        task = {'task': args['task']}
        TODOS[todo_id] = task
        return task, 201
