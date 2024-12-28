#!/usr/bin/env python3

from sqlite3 import IntegrityError
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


class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username:
            return {'error': 'Username is required'}, 400
        if not password:
            return {'error': 'Password is required'}, 400

        user = User.query.filter(User.username == username).first()

        if not user:
            return {'error': 'Not a valid user.'}, 400
        
        try:
            session['username'] = user.username

            user_schema = UserSchema()
            user_data = user_schema.dump(user)
            return user_data, 200
        
        except Exception as e:
            return {'error': str(e)}, 401
                
        

class Signup(Resource):
    def post(self):
        data = request.get_json()  

        user_type = data.get('user_type')
        name = data.get('name')
        username = data.get('username')
        password = data.get('password')

        if not user_type:
            return {'error': 'User type is required.'}, 400
        if not name:
            return {'error': 'Name is required.'}, 400
        if not username:
            return {'error': 'Username is required.'}, 400
        if len(username) < 5:
            return {'error': 'Username must be at least 6 characters'}, 400
        
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return {'error': 'Username is already taken.'}, 400
        
        new_user = User(
                user_type = user_type,
                name = name,
                username = username,
                password = password
            )
            
        try:
            
            db.session.add(new_user)
            db.session.commit()
            session['username'] = new_user.username

            user_schema = UserSchema()
            user_data = user_schema.dump(new_user)
            return user_data, 201
        
        except Exception as e:
            return {'error': str(e)}, 500
        
        
class CheckUsername(Resource):
    def get(self, username):
        existing_user = User.query.filter_by(username=username).first()
        
        if existing_user:
            return {'error': 'Username already exisits.'}, 400
        
        return {'message': 'Username is available.'}, 200
    

class CheckSession(Resource):
    def get(self):
        try:
            username = session.get('username')

            if username:
                user = User.query.filter(User.username == username).first()

                if not user:
                    return {'error': 'User not found.'}, 404
                
                user_schema = UserSchema()
                user_data = user_schema.dump(user)
                return user_data, 200
            
            else:
                # change this to an empty object then update logic on frontend.
                return None, 200

        except Exception as e:
            return {'error': str(e)}, 500
        

class Logout(Resource):
    def delete(self):
        if session.get('username'):
            session.pop('username')
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
                        
        
class UserByUsername(Resource):
    def get(self, username):
        user = User.query.filter_by(username = username).first()

        if not user:
            return {'error': 'User not found'}, 404
        
        user_schema = UserSchema()
        user_data = user_schema.dump(user)
        return user_data, 200
        

    def patch(self, username):
        data = request.get_json()
        user = User.query.filter_by(username = username).first()

        if not user:
            return {'error': 'User not found'}, 404
        
        if 'name' in data:
            user.name = data['name']
        if 'profile_data' in data:
            user.profile_data = data['profile_data']

        try:
            db.session.commit()

            user_schema = UserSchema()
            user_data = user_schema.dump(user)
            return user_data, 200
        
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 422
        
    def delete(self, username):
        user = User.query.filter_by(username = username).first()

        if not user:
            return {'error': 'User not found'}, 404
        
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
            return {'error': str(e)}, 404
                
    def post(self):
        data = request.get_json()
        
        title = data.get('title')
        event_type = data.get('event_type')
        start_date_str = data.get('start_date')
        end_date_str = data.get('end_date')
        description = data.get('description')
        website_link = data.get('website_link')
        user_id = data.get('user_id')

        start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date() if start_date_str else None
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date() if end_date_str else None

        if not title or not start_date or not end_date:
            return {'error': 'Missing required fields'}, 400
        
        new_event = Event(
            title = title,
            event_type = event_type,
            start_date = start_date,
            end_date = end_date,
            description = description,
            website_link = website_link,
            user_id = user_id
        )

        try:
            db.session.add(new_event)
            db.session.commit()

            event_schema = EventSchema()
            event_data = event_schema.dump(new_event)

            return event_data, 201
        
        except Exception as e:
            return {'error': str(e)}, 500
        
        
class EventById(Resource):
    def get(self, event_id):
        event = Event.query.get(event_id)

        if not event:
            return {'error': 'Event not found'}, 404
        
        event_schema = EventSchema()
        event_data = event_schema.dump(event)

        return event_data, 200
    

    def patch(self, event_id):
        data = request.get_json()

        event = Event.query.get(event_id)
        if not event:
            return {'error': 'Event not found'}, 404
        
        if 'event_type' in data:
            event.title = data['event_type']
        if 'title' in data:
            event.title = data['title']
        if 'start_date' in data:
            event.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
        if 'end_date' in data:
            event.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
        if 'description' in data:
            event.description = data['description']
        if 'website_link' in data:
            event.website_link = data['website_link']

        try:
            db.session.commit()

            event_schema = EventSchema()
            event_data = event_schema.dump(event)

            return event_data, 200
        
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 422
        

    def delete(self, event_id):
        event = Event.query.get(event_id)

        if not event:
            return {'error': 'Event not found'}, 404
        
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
        
        user_id = data.get('user_id')
        event_id = data.get('event_id')

        try:
            new_attendee = Attendee(
                user_id = user_id,
                event_id = event_id
            )
            
            db.session.add(new_attendee)
            db.session.commit()

            attendee_schema = AttendeeSchema()
            attendee_data = attendee_schema.dump(new_attendee)
            
            return attendee_data, 201
        
        except ValueError as e:
            return {'error': str(e)}, 400
        
        except IntegrityError as e:
            return {'error': str(e)}, 409

        except Exception as e:
            return {'error': str(e)}, 500


class AttendeeById(Resource):
    def get(self, attendee_id):
        attendee = Attendee.query.get(attendee_id)

        if not attendee:
            return {'error': 'Attendee not found'}, 404
        
        attendee_schema = AttendeeSchema()
        attendee_data = attendee_schema.dump(attendee)
        return attendee_data, 200       

    def delete(self, attendee_id):
        attendee = Attendee.query.get(attendee_id)

        if not attendee:
            return {'error': 'Attendee not found'}, 404
        
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
        
    def post(self):
        data = request.get_json()
        
        user_id = data.get('user_id')
        event_id = data.get('event_id')

        try:
            new_vendor = Vendor(
                user_id = user_id,
                event_id = event_id
            )
            
            db.session.add(new_vendor)
            db.session.commit()

            vendor_schema = VendorSchema()
            vendor_data = vendor_schema.dump(new_vendor)
            
            return vendor_data, 201
        
        except ValueError as e:
            return {'error': str(e)}, 400
        
        except IntegrityError as e:
            return {'error': str(e)}, 409

        except Exception as e:
            return {'error': str(e)}, 500
        

class VendorsById(Resource):
    def get(self, vendor_id):
        vendor = Vendor.query.get(vendor_id)

        if not vendor:
            return {'error': 'Vendor not found'}, 404
        
        vendor_schema = VendorSchema()
        vendor_data = vendor_schema.dump(vendor)
        return vendor_data, 200
    
    def delete(self, vendor_id):
        vendor = Vendor.query.get(vendor_id)

        if not vendor:
            return {'error': 'Vendor not found'}, 404
        
        db.session.delete(vendor)
        db.session.commit()
        return {'message': 'Vendor deleted'}, 200


api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckUsername, '/check_username/<username>', endpoint='check_username')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(Users, '/users', endpoint='users')
api.add_resource(UserByUsername, '/users/<username>', endpoint='user')
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

