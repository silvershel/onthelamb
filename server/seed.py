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
        Vendor.query.delete()
        db.session.commit()

        # Seed Users
        test_user_sheep = User(
            name = "Sheep Test User",
            username = "sheep",
            password = "password",
            user_type = "Sheep",
            profile_photo = "https://cdn.shopify.com/s/files/1/2242/8117/files/shaggie.jpg?v=1735611916",
            latitude = "38.805496",
            longitude = "-77.04344"
        )
        db.session.add(test_user_sheep)
        db.session.commit()

        test_user_shepherd = User(
            name = "Shepherd Test User",
            username = "shepherd",
            password = "password",
            user_type = "Shepherd",
            profile_photo = "https://cdn.shopify.com/s/files/1/2242/8117/files/shaggie.jpg?v=1735611916",
            latitude = "38.805496",
            longitude = "-77.04344"
        )
        db.session.add(test_user_shepherd)
        db.session.commit()

        test_users = [test_user_sheep, test_user_shepherd]

        def generate_username():
            username = fake.user_name() + str(fake.random_number(digits=5))
            return username

        users = []
        used_usernames = set()

        for i in range(10):
            username = generate_username()
            user_type = rc(["Sheep", "Shepherd"])
            profile_photo = "https://cdn.shopify.com/s/files/1/2242/8117/files/shaggie.jpg?v=1735611916"

            while username in used_usernames:
                username = generate_username()

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
            for test_user in test_users:
                event_type = rc(["Festival", "Retreat", "Local Meetup", "Popup", "Trunk Show"])
                event_title = f"{fake.company()} {event_type}"

                event = Event(
                    title=event_title,
                    start_date=fake.future_date(end_date=True),
                    end_date=fake.future_date(end_date=True),
                    creation_date=fake.future_date(),
                    user_id=test_user.id,
                    website_link=fake.url(),
                    description=fake.sentence(),
                    event_type=event_type,
                    address=fake.address()
                )
                events.append(event)

        # events for all users
        for i in range(10):
            user = rc(users)
            event_type = rc(["Festival", "Retreat", "Local Meetup", "Popup", "Trunk Show"])
            event_title = f"{fake.company()} {event_type}"

            event = Event(
                title = event_title,
                start_date = fake.future_date(end_date=True),
                end_date = fake.future_date(end_date=True),
                creation_date = fake.future_date(),
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
            attendees_for_event = []
            attendees_for_event.append(Attendee(user_id=event.user_id, event_id=event.id))

            for i in range(randint(1, 3)):
                user = rc(users)
                attendees_for_event.append(Attendee(user_id=user.id, event_id=event.id))

            attendees.extend(attendees_for_event)

        db.session.add_all(attendees)
        db.session.commit()
        print(f"Created {len(attendees)} attendees.")

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