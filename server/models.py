from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import Integer, String, Date, Float, ForeignKey, Enum, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import validates
from flask_marshmallow import Marshmallow
from marshmallow import fields
from config import db, ma, bcrypt
import re

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    serialize_rules = ('-password', 
                       '-events.user', 
                       '-events.tickets', 
                       '-events.booths', 
                       '-tickets.user', 
                       '-tickets.event', 
                       '-booths.user', 
                       '-booths.event')

    id = db.Column(Integer, primary_key=True)
    user_type = db.Column(Enum('Sheep', 'Shepherd', name='user_type_enum'))
    name = db.Column(String)
    username = db.Column(String, unique=True, nullable=False)
    password = db.Column(String, nullable=False)
    profile_photo = db.Column(String, default='http://localhost:5555/static/assets/default-profile-photo-04.jpg')
    profile_data = db.Column(JSON)
    latitude = db.Column(Float)
    longitude = db.Column(Float)

    events = db.relationship('Event', back_populates='user', cascade='all, delete-orphan')
    tickets = db.relationship('Ticket', back_populates='user', cascade='all, delete-orphan')
    booths = db.relationship('Booth', back_populates='user', cascade='all, delete-orphan')


    # @hybrid_property
    # def password_hash(self):
    #     raise AttributeError('Password hash can not be viewed.')
    
    # @password_hash.setter
    # def password_hash(self, password):
    #     password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
    #     self._password_hash = password_hash.decode('utf-8')

    # def authenticate(self, password):
    #     return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))
    
    # @validates('_password_hash')
    # def validate_password_hash(self, key, _password_hash):
    #     if _password_hash == '':
    #         raise ValueError('Password cannot be empty.')
    #     return _password_hash


    @validates('user_type')
    def validate_type(self, key, user_type):
        if not user_type:
            raise ValueError('User type is required.')
        
        return user_type
    

    @validates('name')
    def validate_name(self, key, name):
        if not name:
            raise ValueError('Name is required.')
        
        return name
    
    
    @validates('username')
    def validate_username(self, key, username):
        if not username:
            raise ValueError('Username is required.')
        
        if len(username) < 5:
            raise ValueError('Username must be at least 5 characters.')
        
        if not re.match(r'^[\w_]+$', username):
            raise ValueError('Username can only contain letters, numbers, and underscores.')
        
        if User.query.filter_by(username=username).first():
            raise ValueError(f'Username already exists.')
        
        return username


class Event(db.Model, SerializerMixin):
    __tablename__ = 'events'

    serialize_rules = ('-user.events', 
                       '-user.tickets', 
                       '-user.booths', 
                       '-tickets.event', 
                       '-tickets.user', 
                       '-booths.event', 
                       '-booths.user')

    id = db.Column(Integer, primary_key=True)
    event_type = db.Column(Enum('Local Meetup', 'Festival', 'Retreat', 'Popup', 'Trunk Show', name='event_type_enum'), nullable=False)
    title = db.Column(String, nullable=False)
    address = db.Column(JSON)
    start_date = db.Column(Date, nullable=False)
    end_date = db.Column(Date)
    creation_date = db.Column(Date, nullable=False, default=func.current_date())
    description = db.Column(String, nullable=False)
    website_link = db.Column(String)
    user_id = db.Column(Integer, ForeignKey('users.id'), nullable=False)
    
    user = db.relationship('User', back_populates='events')
    tickets = db.relationship('Ticket', back_populates='event', cascade='all, delete-orphan')
    booths = db.relationship('Booth', back_populates='event', cascade='all, delete-orphan')


    # VALIDATIONS
    # Name must be present
    # Limit what event type can be created beased on user type
    # Date validation. No end date means end date is start date
    # Start date must be current date or after
    # End date must be later than start date


class Ticket(db.Model, SerializerMixin):
    __tablename__ = 'tickets'

    serialize_rules = ('-user.booth', 
                       '-user.events', 
                       '-user.tickets', 
                       '-event.user', 
                       '-event.tickets',
                       '-event.booths',)
    
    comment = db.Column(String)
    id = db.Column(Integer, primary_key=True)
    user_id = db.Column(Integer, ForeignKey('users.id'), nullable=False)
    event_id = db.Column(Integer, ForeignKey('events.id'), nullable=False)

    user = db.relationship('User', back_populates='tickets')
    event = db.relationship('Event', back_populates='tickets')

    @validates('user_id')
    def validate_user_id(self, key, user_id):
        if not user_id:
            raise ValueError('User ID is required.')  

        if not User.query.get(user_id):
            raise ValueError('User does not exist.')
        
        return user_id

    @validates('event_id')
    def validate_event_id(self, key, event_id):
        if not event_id:
            raise ValueError('Event ID is required.')
        
        if not Event.query.get(event_id):
            raise ValueError('Event does not exist')
        
        if Ticket.query.filter_by(user_id=self.user_id, event_id=event_id).first():
            raise ValueError(f'User is already attending this event.')
        
        return event_id
    

class Booth(db.Model, SerializerMixin):
    __tablename__ = 'booths'

    serialize_rules = ('-user.booth', 
                       '-user.events', 
                       '-user.tickets', 
                       '-event.user', 
                       '-event.tickets',
                       '-event.booths',)

    id = db.Column(Integer, primary_key=True)
    user_id = db.Column(Integer, ForeignKey('users.id'), nullable=False)
    event_id = db.Column(Integer, ForeignKey('events.id'), nullable=False)

    user = db.relationship('User', back_populates='booths')
    event = db.relationship('Event', back_populates='booths')

    @validates('user_id')
    def validate_user_id(self, key, user_id):
        if not user_id:
            raise ValueError('User ID is required.')  

        if not User.query.get(user_id):
            raise ValueError('User does not exist.')
        
        return user_id

    @validates('event_id')
    def validate_event_id(self, key, event_id):
        if not event_id:
            raise ValueError('Event ID is required.')
        
        if not Event.query.get(event_id):
            raise ValueError('Event does not exist')
        
        if Booth.query.filter_by(user_id=self.user_id, event_id=event_id).first():
            raise ValueError(f'User is already vending at this event.')
        
        return event_id


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        exclude = ('password',)

    events = ma.Nested('EventSchema', many=True, exclude=('user', 'tickets', 'booths'))
    tickets = ma.Nested('TicketSchema', many=True, exclude=('user', 'event'))
    booths = ma.Nested('BoothSchema', many=True, exclude=('user', 'event'))
    
class EventSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Event
        load_instance = True

    user = ma.Nested('UserSchema', exclude=('events', 'tickets', 'booths'))
    tickets = ma.Nested('TicketSchema', many=True, exclude=('event', 'user'))
    booths = ma.Nested('BoothSchema', many=True, exclude=('event', 'user'))


class TicketSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Ticket
        load_instance = True
    
    user_id = fields.Integer()
    event_id = fields.Integer()

    user = ma.Nested('UserSchema', exclude=('tickets', 'events', 'booths'))
    event = ma.Nested('EventSchema', exclude=('tickets', 'booths', 'user'))

class BoothSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Booth
        load_instance = True

    user_id = fields.Integer()
    event_id = fields.Integer()

    user = ma.Nested('UserSchema', exclude=('tickets', 'events', 'booths'))
    event = ma.Nested('EventSchema', exclude=('tickets', 'booths', 'user'))