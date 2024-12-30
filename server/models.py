from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import Integer, String, Date, Float, ForeignKey, Enum, JSON
from sqlalchemy.orm import validates
from flask_marshmallow import Marshmallow
from marshmallow import fields
from config import db, ma, bcrypt
import re

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    serialize_rules = ('-password', '-events.user', '-attendees.user', '-vendors.user')

    id = db.Column(Integer, primary_key=True)
    user_type = db.Column(Enum('Sheep', 'Shepherd', name='user_type_enum'))
    name = db.Column(String)
    username = db.Column(String, unique=True, nullable=False)
    password = db.Column(String, nullable=False)
    profile_photo = db.Column(String, default="https://modernfarmer.com/wp-content/uploads/2017/12/Funny-Sheep-Facts-jpg.webp")
    profile_data = db.Column(JSON)
    latitude = db.Column(Float)
    longitude = db.Column(Float)

    events = db.relationship('Event', back_populates='user', cascade='all, delete-orphan')
    attendees = db.relationship('Attendee', back_populates='user', cascade='all, delete-orphan')
    vendors = db.relationship('Vendor', back_populates='user', cascade='all, delete-orphan')


    # @hybrid_property
    # def password_hash(self):
    #     raise AttributeError("Password hash can not be viewed.")
    
    # @password_hash.setter
    # def password_hash(self, password):
    #     password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
    #     self._password_hash = password_hash.decode('utf-8')

    # def authenticate(self, password):
    #     return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))
    
    # @validates('_password_hash')
    # def validate_password_hash(self, key, _password_hash):
    #     if _password_hash == "":
    #         raise ValueError("Password cannot be empty.")
    #     return _password_hash


    @validates('user_type')
    def validate_type(self, key, user_type):
        if not user_type:
            raise ValueError("User type is required.")
        
        return user_type
    

    @validates('name')
    def validate_name(self, key, name):
        if not name:
            raise ValueError("Name is required.")
        
        return name
    
    
    @validates('username')
    def validate_username(self, key, username):
        if not username:
            raise ValueError("Username is required.")
        
        if len(username) < 5:
            raise ValueError("Username must be at least 5 characters.")
        
        if not re.match(r'^[\w_]+$', username):
            raise ValueError("Username can only contain letters, numbers, and underscores.")
        
        if User.query.filter_by(username=username).first():
            raise ValueError(f"Username already exists.")
        
        return username


class Event(db.Model, SerializerMixin):
    __tablename__ = 'events'

    serialize_rules = ('-user.events', '-attendees.event', '-vendors.event')

    id = db.Column(Integer, primary_key=True)
    event_type = db.Column(Enum('Local Meetup', 'Festival', 'Retreat', 'Popup', 'Trunk Show', name='event_type_enum'), nullable=False)
    title = db.Column(String, nullable=False)
    address = db.Column(JSON)
    start_date = db.Column(Date, nullable=False)
    end_date = db.Column(Date)
    description = db.Column(String, nullable=False)
    website_link = db.Column(String)
    user_id = db.Column(Integer, ForeignKey('users.id'), nullable=False)
    
    user = db.relationship('User', back_populates='events')
    attendees = db.relationship('Attendee', back_populates='event', cascade='all, delete-orphan')
    vendors = db.relationship('Vendor', back_populates='event', cascade='all, delete-orphan')

    # VALIDATIONS
    # Name must be present
    # Limit what event type can be created beased on user type
    # Date validation. No end date means end date is start date
    # Start date must be current date or after
    # End date must be later than start date


class Attendee(db.Model, SerializerMixin):
    __tablename__ = 'attendees'

    serialize_rules = ('user.attendees', 'event.attendees',)

    id = db.Column(Integer, primary_key=True)
    user_id = db.Column(Integer, ForeignKey('users.id'), nullable=False)
    event_id = db.Column(Integer, ForeignKey('events.id'), nullable=False)

    user = db.relationship('User', back_populates='attendees')
    event = db.relationship('Event', back_populates='attendees')

    @validates('user_id')
    def validate_user_id(self, key, user_id):
        if not user_id:
            raise ValueError("User ID is required.")  

        if not User.query.get(user_id):
            raise ValueError("User does not exist.")
        
        return user_id

    @validates('event_id')
    def validate_event_id(self, key, event_id):
        if not event_id:
            raise ValueError("Event ID is required.")
        
        if not Event.query.get(event_id):
            raise ValueError("Event does not exist")
        
        if Attendee.query.filter_by(user_id=self.user_id, event_id=event_id).first():
            raise ValueError(f"User is already attending this event.")
        
        return event_id
    

class Vendor(db.Model, SerializerMixin):
    __tablename__ = 'vendors'

    serialize_rules = ('user.vendors', 'event.vendors',)

    id = db.Column(Integer, primary_key=True)
    comment = db.Column(String)
    user_id = db.Column(Integer, ForeignKey('users.id'), nullable=False)
    event_id = db.Column(Integer, ForeignKey('events.id'), nullable=False)

    user = db.relationship('User', back_populates='vendors')
    event = db.relationship('Event', back_populates='vendors')

    @validates('user_id')
    def validate_user_id(self, key, user_id):
        if not user_id:
            raise ValueError("User ID is required.")  

        if not User.query.get(user_id):
            raise ValueError("User does not exist.")
        
        return user_id

    @validates('event_id')
    def validate_event_id(self, key, event_id):
        if not event_id:
            raise ValueError("Event ID is required.")
        
        if not Event.query.get(event_id):
            raise ValueError("Event does not exist")
        
        if Vendor.query.filter_by(user_id=self.user_id, event_id=event_id).first():
            raise ValueError(f"User is already vending at this event.")
        
        return event_id


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        exclude = ('password',)

    id = fields.Integer()

class AttendeeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Attendee
        load_instance = True
    
    user_id = fields.Integer()
    event_id = fields.Integer()
    user = ma.Nested(UserSchema)

class VendorSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Vendor
        load_instance = True
    user = ma.Nested(UserSchema)

class EventSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Event
        load_instance = True
        field_order = ['id', 'title', 'event_type', 'start_date', 'end_date', 'website_link', 'description', 'user_id', 'user', 'attendees', 'vendors']

    id = fields.Integer()
    title = fields.String()
    event_type = fields.String()
    start_date = fields.DateTime()
    end_date = fields.DateTime()
    website_link = fields.String()
    description = fields.String()
    user_id = fields.Integer()

    user = ma.Nested('UserSchema')
    attendees = ma.Nested('AttendeeSchema', many=True)
    vendors = ma.Nested('VendorSchema', many=True)