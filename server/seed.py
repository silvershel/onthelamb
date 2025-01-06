#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Event, Ticket, Booth

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print('Starting seed...')
        
        # Delete Existing Data
        User.query.delete()
        Event.query.delete()
        Ticket.query.delete()
        Booth.query.delete()
        db.session.commit()

        # Seed Users
        test_user_sheep = User(
            name = 'Sheep Test User',
            username = 'sheep',
            password = 'password',
            user_type = 'sheep',
            profile_photo = 'http://localhost:5555/static/assets/default-profile-photo-01.jpg',
            latitude = '38.805496',
            longitude = '-77.04344'
        )
        db.session.add(test_user_sheep)
        db.session.commit()

        test_user_shepherd = User(
            name = 'Shepherd Test User',
            username = 'shepherd',
            password = 'password',
            user_type = 'shepherd',
            profile_photo = 'http://localhost:5555/static/assets/default-profile-photo-01.jpg',
            latitude = '38.805496',
            longitude = '-77.04344'
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
            user_type = rc(['sheep', 'shepherd'])
            profile_photo = 'http://localhost:5555/static/assets/default-profile-photo-01.jpg'

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
        print(f'Created {len(users)} users.')

        # Seed Events
        events = []

        # events specific to test users 1 and 2
        for i in range(6):
            for test_user in test_users:
                event_type = rc(['festival', 'retreat', 'local meetup', 'popup', 'trunk show'])
                event_title = f'{fake.company()} {event_type}'

                event = Event(
                    title=event_title,
                    start_date=fake.future_date(end_date=True),
                    end_date=fake.future_date(end_date=True),
                    creation_date=fake.future_date(end_date=True),
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
            event_type = rc(['festival', 'retreat', 'local meetup', 'popup', 'trunk show'])
            event_title = f'{fake.company()} {event_type}'

            event = Event(
                title = event_title,
                start_date = fake.future_date(end_date=True),
                end_date = fake.future_date(end_date=True),
                creation_date = fake.future_date(end_date=True),
                user_id = user.id,
                website_link = fake.url(),
                description = fake.sentence(),
                event_type = event_type,
                address = fake.address()
            )
            events.append(event)

        db.session.add_all(events)
        db.session.commit()
        print(f'Created {len(events)} events.')

        # Seed Tickets
        tickets = []
        for event in events:
            for i in range(randint(3, 10)):
                user = rc(users)
                ticket = Ticket(
                    user_id = user.id,
                    event_id = event.id,
                    comment = fake.sentence(),
                )
                tickets.append(ticket)
                
        db.session.add_all(tickets)
        db.session.commit()
        print(f'Created {len(tickets)} tickets.')

        # Seed Booths
        booths = []
        for event in events:
            for i in range(randint(3, 10)):
                user = rc(users)
                booth = Booth(
                    user_id = user.id,
                    event_id = event.id,
                )
                booths.append(booth)

        db.session.add_all(booths)
        db.session.commit()
        print(f'Created {len(booths)} booths.')

        print('Seeding complete.')