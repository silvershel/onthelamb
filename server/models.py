from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import Integer, String, Date, Float, ForeignKey, Enum, JSON
from sqlalchemy.orm import validates
from flask_marshmallow import Marshmallow
from marshmallow import fields
from config import db, ma, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    serialize_rules = ('-password', '-events.user', '-attendees.user', '-vendors.user')

    id = db.Column(Integer, primary_key=True)
    name = db.Column(String)
    username = db.Column(String, unique=True, nullable=False)
    password = db.Column(String, nullable=False)
    user_type = db.Column(Enum('sheep', 'shepherd', name='user_type_enum'))
    profile_photo = db.Column(String, default="https://cdn.dribbble.com/userupload/17756893/file/original-aa925a9bb546f667dd24b56715c3da7e.png?format=webp&resize=400x300&vertical=center")
    profile_data = db.Column(JSON)
    latitude = db.Column(Float)
    longitude = db.Column(Float)

    events = db.relationship('Event', back_populates='user', cascade='all, delete-orphan')
    attendees = db.relationship('Attendee', back_populates='user', cascade='all, delete-orphan')
    vendors = db.relationship('Vendor', back_populates='user', cascade='all, delete-orphan')


    # VALIDATIONS
    # Password hashing
    # Password must be at least 8 characters, contain 1 number and 1 special character
    # Username must be unique

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
    
    # @validates('username')
    # def validate_username(self, key, username):
    #     if not username:
    #         raise ValueError("Username must be present.")
        
    #     existing_username = User.query.filter(User.username == username).first()
    #     if existing_username:
    #         raise ValueError("Username must be unique.")
        
    #     if len(username) < 6:
    #         raise ValueError('Username must be at least 6 characters long.')
    #     return username


class Event(db.Model, SerializerMixin):
    __tablename__ = 'events'

    serialize_rules = ('-user.events', '-attendees.event', '-vendors.event')

    id = db.Column(Integer, primary_key=True)
    event_type = db.Column(Enum('local meetup', 'festival', 'retreat', 'popup', 'trunk_show', name='event_type_enum'), nullable=False)
    # stretch idea: Add option for virtual events. Consider how that might impact address info and location services.
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


class Vendor(db.Model, SerializerMixin):
    __tablename__ = 'vendors'

    serialize_rules = ('user.vendors', 'event.vendors',)

    id = db.Column(Integer, primary_key=True)
    comment = db.Column(String)
    user_id = db.Column(Integer, ForeignKey('users.id'), nullable=False)
    event_id = db.Column(Integer, ForeignKey('events.id'), nullable=False)

    user = db.relationship('User', back_populates='vendors')
    event = db.relationship('Event', back_populates='vendors')


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
        # Specified field order for returning data in Postman
        field_order = ['id', 'title', 'event_type', 'start_date', 'end_date', 'website_link', 'user_id', 'user', 'attendees', 'vendors']

    # Defining the fields to have more control over serialization
    id = fields.Integer()
    title = fields.String()
    event_type = fields.String()
    start_date = fields.DateTime()
    end_date = fields.DateTime()
    website_link = fields.String()
    user_id = fields.Integer()

    user = ma.Nested('UserSchema')
    attendees = ma.Nested('AttendeeSchema', many=True)
    vendors = ma.Nested('VendorSchema', many=True)