#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Event, Attendee, Vendor

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        
        # Delete Existing Data
        User.query.delete()
        Event.query.delete()
        Attendee.query.delete()
        db.session.commit()

        # Seed Users
        test_user_sheep = User(
            name = "Sheep Test User",
            username = "sheep",
            password = "password",
            user_type = "sheep",
            profile_photo = "https://cdn.dribbble.com/userupload/17756893/file/original-aa925a9bb546f667dd24b56715c3da7e.png?format=webp&resize=400x300&vertical=center",
            latitude = "38.805496",
            longitude = "-77.04344"
        )
        db.session.add(test_user_sheep)
        db.session.commit()

        test_user_shepherd = User(
            name = "Shepherd Test User",
            username = "shepherd",
            password = "password",
            user_type = "shepherd",
            profile_photo = "https://cdn.dribbble.com/userupload/17756893/file/original-aa925a9bb546f667dd24b56715c3da7e.png?format=webp&resize=400x300&vertical=center",
            latitude = "38.805496",
            longitude = "-77.04344"
        )
        db.session.add(test_user_shepherd)
        db.session.commit()

        users = []
        used_usernames = set()

        for i in range(10):
            username = fake.user_name()
            user_type = rc(['sheep', 'shepherd'])
            profile_photo = 'https://cdn.dribbble.com/userupload/17756893/file/original-aa925a9bb546f667dd24b56715c3da7e.png?format=webp&resize=400x300&vertical=center'

            while username in used_usernames:
                username = fake.user_name()

            used_usernames.add(username)

            user = User(
                name=fake.name(),
                username = username,
                password = fake.password(),
                profile_photo = profile_photo,
                user_type = user_type,
                latitude = fake.latitude(),
                longitude = fake.longitude()
            )
            
            users.append(user)

        db.session.add_all(users)
        db.session.commit()
        print(f"Created {len(users)} users.")

        # Seed Events
        events = []

        # events specific to test users 1 and 2
        for i in range(6):
            event_type = rc(['festival', 'retreat', 'local meetup', 'popup'])
            event_title = f"{fake.company()} {event_type}"

            event = Event(
                title = event_title,
                start_date = fake.future_date(end_date=True),
                end_date = fake.future_date(end_date=True),
                user_id = rc(["1", "2"]),
                website_link = fake.url(),
                description = fake.sentence(),
                event_type = event_type,
                address = fake.address()
            )
            events.append(event)

        # events for all users
        for i in range(10):
            user = rc(users)
            event_type = rc(['festival', 'retreat', 'local meetup', 'popup'])
            event_title = f"{fake.company()} {event_type}"

            event = Event(
                title = event_title,
                start_date = fake.future_date(end_date=True),
                end_date = fake.future_date(end_date=True),
                user_id = user.id,
                website_link = fake.url(),
                description = fake.sentence(),
                event_type = event_type,
                address = fake.address()
            )
            events.append(event)

        db.session.add_all(events)
        db.session.commit()
        print(f"Created {len(events)} events.")

        # Seed Attendees
        attendees = []
        for event in events:
            for i in range(randint(3, 10)):
                user = rc(users)
                attendee = Attendee(
                    user_id=user.id,
                    event_id=event.id,
                    comment=fake.sentence()
                )
                attendees.append(attendee)

        db.session.add_all(attendees)
        db.session.commit()
        print(f"Created {len(attendees)} attendees.")

        print("Seeding complete.")

        # Seed Vendors
        vendors = []
        for event in events:
            for i in range(randint(3, 10)):
                user = rc(users)
                vendor = Vendor(
                    user_id=user.id,
                    event_id=event.id,
                    comment=fake.sentence()
                )
                vendors.append(vendor)

        db.session.add_all(vendors)
        db.session.commit()
        print(f"Created {len(vendors)} vendors.")

        print("Seeding complete.")