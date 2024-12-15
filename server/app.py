#!/usr/bin/env python3

from flask import request, session, jsonify
from flask_restful import Resource
from config import app, db, api
from models import User, Event, Attendee, Vendor, UserSchema, AttendeeSchema, VendorSchema, EventSchema
from datetime import datetime

# Notes on status Codes
    # 200 successful GET requests.
    # 201 POST requests where a resource is created.
    # 400 the server cannot process the request due to something that is perceived to be client-side error.
    # 401 When a user tries to access a protected endpoint without being authenticated.
    # 404 GET requests that do not exist in the database.
    # 422 POST requests with invalid data.
    # 500 An unexpected error.


class Signup(Resource):
    def post(self):
        data = request.get_json()
        
        name = data.get('name')
        user_type = data.get('user_type')
        username = data.get('username')
        password = data.get('password')

        errors = {}

        if not user_type:
            errors['user_type'] = 'User type must be selected.'
        if not username:
            errors['username'] = 'Username error.'
        if not password:
            errors['password'] = 'Password error.'
        
        if errors:
            return {'errors': errors}, 422
            
        new_user = User(
            name = name,
            user_type = user_type,
            username = username,
            password = password
        )

        try:
            db.session.add(new_user)
            db.session.commit()
            session['user_id'] = new_user.id

            response = {
                'id': new_user.id,
                'name': new_user.name,
                'user_type': new_user.user_type,
                'username': new_user.username,
            }

            return response, 201
        
        except Exception:
            return {'message': 'Signup error'}, 422
    

class CheckSession(Resource):
    def get(self):
        try:
            user_id = session.get('user_id')

            if user_id:
                user = User.query.get(user_id)

                if not user:
                    return {'message': 'User not found.'}, 404
                    
                else:
                    user_data = UserSchema.dumps(user)
                    return user_data, 200
            else:
                return {'message': 'No user in session.'}, 404

        except Exception as e:
            return {'error': str(e)}, 500
        

class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return {'message': 'Username and password are required'}, 400

        user = User.query.filter(User.username == username).first()

        if user:
            session['user_id'] = user.id

            response = {
                'id': user.id,
                'name': user.name,
                'user_type': user.user_type,
                'username': user.username,
            }

            return response, 200
        
        else:
            return {"error": "Login unsuccessful"}, 401
        

class Logout(Resource):
    def delete(self):
        if session.get('user_id'):
            session.pop('user_id')
            return {}, 204
        else:
            return {'error': 'No user logged in'}, 400
        
        
class Users(Resource):
    def get(self):
        try:
            users = User.query.all()
            
            user_schema = UserSchema(many=True)
            users_data = user_schema.dump(users)

            return users_data, 200

        except Exception as e:
            return {'error': str(e)}, 422
                        
        
class UserById(Resource):
    def get(self, user_id):
        user = User.query.get(user_id)

        if not user:
            return {'message': 'User not found'}, 404
        
        user_schema = UserSchema()
        user_data = user_schema.dump(user)

        return user_data, 200
        

    def patch(self, user_id):
        data = request.get_json()
        user = User.query.get(user_id)

        if not user:
            return {'message': 'User not found'}, 404
        
        if 'name' in data:
            user.name = data['name']
        if 'profile_data' in data:
            user.profile_data = data['profile_data']

        try:
            db.session.commit()

            response = {
                'id': user.id,
                'name': user.name,
                'profile_data': user.profile_data
            }

            return response, 200
        
        except Exception as e:
            db.session.rollback()
            return {'message': 'Error updating user', 'error': str(e)}, 422
        
    def delete(self, user_id):
        user = User.query.get(user_id)

        if not user:
            return {'message': 'User not found'}, 404
        
        db.session.delete(user)
        db.session.commit()
        return {'message': 'User deleted'}, 200
    
class Events(Resource):
    def get(self):
        try:
            events = Event.query.all()
            
            event_schema = EventSchema(many=True)
            events_data = event_schema.dump(events)

            return events_data, 200

        except Exception as e:
            return {'message': str(e)}, 404
                
    def post(self):
        data = request.get_json()
        
        title = data.get('title')
        event_type = data.get('event_type')
        start_date_str = data.get('start_date')
        end_date_str = data.get('end_date')
        website_link = data.get('website_link')
        user_id = data.get('user_id')

        start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date() if start_date_str else None
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date() if end_date_str else None

        if not title or not start_date or not end_date:
            return {'message': 'Missing required fields'}, 400
        
        new_event = Event(
            title = title,
            event_type = event_type,
            start_date = start_date,
            end_date = end_date,
            website_link = website_link,
            user_id = user_id
        )

        try:
            db.session.add(new_event)
            db.session.commit()

            response = {
                'id': new_event.id,
                'title': new_event.title,
                'event_type': new_event.event_type,
                'start_date': new_event.start_date.isoformat(),
                'end_date': new_event.end_date.isoformat(),
                'website_link': new_event.website_link,
                'user_id': new_event.user_id
            }

            return response, 201
        
        except Exception as e:
            return {'message': str(e)}, 500
        
        
class EventById(Resource):
    def get(self, event_id):
        event = Event.query.get(event_id)

        if not event:
            return {'message': 'Event not found'}, 404
        
        event_schema = EventSchema()
        event_data = event_schema.dump(event)

        return event_data, 200
    

    def patch(self, event_id):
        data = request.get_json()

        event = Event.query.get(event_id)
        if not event:
            return {'message': 'Event not found'}, 404
        
        if 'title' in data:
            event.title = data['title']
        if 'type' in data:
            event.event_type = data['event_type']
        if 'start_date' in data:
            event.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
        if 'end_date' in data:
            event.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
        if 'website_link' in data:
            event.website_link = data['website_link']

        try:
            db.session.commit()

            response = {
                'id': event.id,
                'title': event.title,
                'event_type': event.event_type,
                'start_date': event.start_date.isoformat(),
                'end_date': event.end_date.isoformat(),
                'website_link': event.website_link,
                'user_id': event.user_id
            }

            return response, 200
        
        except Exception as e:
            db.session.rollback()
            return {'message': 'Error updating event', 'error': str(e)}, 422
        

    def delete(self, event_id):
        event = Event.query.get(event_id)

        if not event:
            return {'message': 'Event not found'}, 404
        
        db.session.delete(event)
        db.session.commit()
        return {'message': 'Event deleted'}, 200
    
    
class Attendees(Resource):
    def get(self):
        try:
            attendees = Attendee.query.all()
            
            attendee_schema = AttendeeSchema(many=True)
            attendee_data = attendee_schema.dump(attendees)

            return attendee_data, 200

        except Exception as e:
            return {'error': str(e)}, 422
        

    def post(self):
        data = request.get_json()
        
        comment = data.get('comment')
        user_id = data.get('user_id')
        event_id = data.get('event_id')
        
        new_attendee = Attendee(
            comment = comment,
            user_id = user_id,
            event_id = event_id
        )

        try:
            db.session.add(new_attendee)
            db.session.commit()
            
            response = {
                'id': new_attendee.id,
                'comment': new_attendee.comment,
                'user_id': new_attendee.user_id,
                'event_id': new_attendee.event_id,
            }
            return response, 201
        
        except Exception as e:
            return {'message': str(e)}, 500


class AttendeeById(Resource):
    def get(self, attendee_id):
        attendee = Attendee.query.get(attendee_id)

        if not attendee:
            return {'message': 'Attendee not found'}, 404
        
        attendee_schema = AttendeeSchema()
        attendee_data = attendee_schema.dump(attendee)
        return attendee_data, 200
    
     
    def patch(self, attendee_id):
        data = request.get_json()

        attendee = Attendee.query.get(attendee_id)

        if not attendee:
            return {'message': 'Attendee not found'}, 404
        
        if 'comment' in data:
            attendee.comment = data['comment']

        try:
            db.session.commit()
            response = {
                "id": attendee.id,
                "comment": attendee.comment, 
                "user_id": attendee.user_id,
                "event_id": attendee.event_id
            }

            return response, 200
        
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 422
        

    def delete(self, attendee_id):
        attendee = Attendee.query.get(attendee_id)

        if not attendee:
            return {'message': 'Attendee not found'}, 404
        
        db.session.delete(attendee)
        db.session.commit()
        return {'message': 'Attendee deleted'}, 200
    
class Vendors(Resource):
    def get(self):
        try:
            vendors = Vendor.query.all()
            
            vendor_schema = VendorSchema(many=True)
            vendor_data = vendor_schema.dump(vendors)

            return vendor_data, 200

        except Exception as e:
            return {'error': str(e)}, 422

class VendorsById(Resource):
    def get(self, vendor_id):
        vendor = Vendor.query.get(vendor_id)

        if not vendor:
            return {'message': 'Vendor not found'}, 404
        
        vendor_schema = VendorSchema()
        vendor_data = vendor_schema.dump(vendor)
        return vendor_data, 200


api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(Users, '/users', endpoint='users')
api.add_resource(UserById, '/users/<int:user_id>', endpoint='user')
api.add_resource(Events, '/events', endpoint='events')
api.add_resource(EventById, '/events/<int:event_id>', endpoint='event')
api.add_resource(Attendees, '/attendees', endpoint='attendees')
api.add_resource(AttendeeById, '/attendees/<int:attendee_id>', endpoint='attendee')
api.add_resource(Vendors, '/vendors', endpoint='vendors')
api.add_resource(VendorsById, '/vendors/<int:vendor_id>', endpoint='vendor')


@app.route('/')
def index():
    return '<h1>Project Server</h1>'

if __name__ == '__main__':
    app.run(port=5555, debug=True)

