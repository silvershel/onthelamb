#!/usr/bin/env python3

from sqlite3 import IntegrityError
from flask import request, session, jsonify
from flask_restful import Resource
from config import app, db, api
from models import User, Event, Ticket, Booth, UserSchema, TicketSchema, BoothSchema, EventSchema
from datetime import datetime
import pdb


class Login(Resource):
    def post(self):
        data = request.get_json()
        
        username = data.get('username').lower()
        password = data.get('password')

        user = User.query.filter(User.username == username).first()

        if not user:
            return {'error': 'Not a valid user.'}, 400
        if not username:
            return {'error': 'Username is required'}, 400
        if not password:
            return {'error': 'Password is required'}, 400

        try:
            session['username'] = user.username

            user_schema = UserSchema()
            user_data = user_schema.dump(user)
            return user_data, 200

        except Exception as e:
            return {'error': str(e)}, 401


# checked and working in postman
class Signup(Resource):
    def post(self):
        data = request.get_json()  

        user_type = data.get('user_type')
        name = data.get('name')
        username = data.get('username')
        password = data.get('password')

        try:
            new_user = User(
                user_type = user_type,
                name = name,
                username = username.lower(),
                password = password
            )

            db.session.add(new_user)
            db.session.commit()
            session['username'] = new_user.username

            user_schema = UserSchema()
            user_data = user_schema.dump(new_user)
            return user_data, 201

        except ValueError as e:
            return {'error': str(e)}, 400

        except IntegrityError as e:
            return {'error': str(e)}, 409

        except Exception as e:
            return {'error': str(e)}, 500


class CheckUsername(Resource):
    def get(self, username):
        username = username.lower()
        existing_user = User.query.filter_by(username=username).first()
        
        if existing_user:
            return {'error': 'Username already exists.'}, 400
        
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
        return {'message': 'User deleted'}, 201

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
        creation_date = datetime.now().date()
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
            creation_date = creation_date,
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


# checked and working in postman
class Tickets(Resource):
    def get(self):
        try:
            tickets = Ticket.query.all()

            ticket_schema = TicketSchema(many=True)
            ticket_data = ticket_schema.dump(tickets)
            return ticket_data, 200

        except Exception as e:
            return {'error': str(e)}, 422


    def post(self):
        data = request.get_json()

        user_id = data.get('user_id')
        event_id = data.get('event_id')
        comment = data.get('comment')

        try:
            new_ticket = Ticket(
                user_id = user_id,
                event_id = event_id,
                comment = comment
            )

            db.session.add(new_ticket)
            db.session.commit()

            ticket_schema = TicketSchema()
            ticket_data = ticket_schema.dump(new_ticket)           
            return ticket_data, 201

        except ValueError as e:
            return {'error': str(e)}, 400

        except IntegrityError as e:
            return {'error': str(e)}, 409

        except Exception as e:
            return {'error': str(e)}, 500


# checked and working in postman
class TicketById(Resource):
    def get(self, ticket_id):
        ticket = Ticket.query.get(ticket_id)

        if not ticket:
            return {'error': 'Ticket not found'}, 404

        ticket_schema = TicketSchema()
        ticket_data = ticket_schema.dump(ticket)
        return ticket_data, 200

    def delete(self, ticket_id):
        ticket = Ticket.query.get(ticket_id)

        if not ticket:
            return {'error': 'Ticket not found'}, 404

        db.session.delete(ticket)
        db.session.commit()
        return {'message': 'Ticket deleted'}, 200


# checked and working in postman
class Booths(Resource):
    def get(self):
        try:
            booths = Booth.query.all()

            booth_schema = BoothSchema(many=True)
            booth_data = booth_schema.dump(booths)
            return booth_data, 200

        except Exception as e:
            return {'error': str(e)}, 422

    def post(self):
        data = request.get_json()
        
        user_id = data.get('user_id')
        event_id = data.get('event_id')

        try:
            new_booth = Booth(
                user_id = user_id,
                event_id = event_id
            )
            
            db.session.add(new_booth)
            db.session.commit()

            booth_schema = BoothSchema()
            booth_data = booth_schema.dump(new_booth)    
            return booth_data, 201

        except ValueError as e:
            return {'error': str(e)}, 400

        except IntegrityError as e:
            return {'error': str(e)}, 409

        except Exception as e:
            return {'error': str(e)}, 500


# checked and working in postman
class BoothById(Resource):
    def get(self, booth_id):
        booth = Booth.query.get(booth_id)

        if not booth:
            return {'error': 'Booth not found'}, 404

        booth_schema = BoothSchema()
        booth_data = booth_schema.dump(booth)
        return booth_data, 200

    def delete(self, booth_id):
        booth = Booth.query.get(booth_id)

        if not booth:
            return {'error': 'Booth not found'}, 404

        db.session.delete(booth)
        db.session.commit()
        return {'message': 'Booth deleted'}, 200


api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckUsername, '/check_username/<username>', endpoint='check_username')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(Users, '/users', endpoint='users')
api.add_resource(UserByUsername, '/users/<username>', endpoint='user')
api.add_resource(Events, '/events', endpoint='events')
api.add_resource(EventById, '/events/<int:event_id>', endpoint='event')
api.add_resource(Tickets, '/tickets', endpoint='tickets')
api.add_resource(TicketById, '/tickets/<int:ticket_id>', endpoint='ticket')
api.add_resource(Booths, '/booths', endpoint='booths')
api.add_resource(BoothById, '/booths/<int:booth_id>', endpoint='booth')


@app.route('/')
def index():
    return '<h1>Project Server</h1>'

if __name__ == '__main__':
    app.run(port=5555, debug=True)

