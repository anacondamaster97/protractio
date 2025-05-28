from faker import Faker
import random
from datetime import datetime, timedelta, date
import uuid
from decimal import Decimal
import json
from pathlib import Path

# Updated JSON encoder to handle dates cleanly
class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (datetime, date)):
            return obj.strftime('%Y-%m-%d')  # Format as YYYY-MM-DD
        if isinstance(obj, Decimal):
            return str(obj)
        if isinstance(obj, uuid.UUID):
            return str(obj)
        return super().default(obj)

fake = Faker()

# Helper function to generate random dates within a range
def random_date(start_date, end_date):
    time_between = end_date - start_date
    days_between = time_between.days
    random_days = random.randrange(days_between)
    return start_date + timedelta(days=random_days)

# Generate customer data
def generate_customers(num_records=100):
    customers = []
    occupations = ['Software Engineer', 'Teacher', 'Doctor', 'Sales Representative', 
                   'Marketing Manager', 'Student', 'Business Analyst', 'Designer']
    
    for _ in range(num_records):
        customer = {
            'first_name': fake.first_name(),
            'last_name': fake.last_name(),
            'email': fake.unique.email(),
            'age': random.randint(18, 80),
            'gender': random.choice(['Male', 'Female', 'Non-binary', 'Other']),
            'location': fake.city(),
            'occupation': random.choice(occupations),
            'auth_user_id': str(uuid.uuid4())
        }
        customers.append(customer)
    return customers

# Generate campaign data
def generate_campaigns(num_records=20):
    campaigns = []
    channels = ['Social Media', 'Email', 'Search Ads', 'Display Ads', 'Content Marketing']
    audiences = ['Young Professionals', 'Students', 'Parents', 'Senior Citizens', 
                 'Small Business Owners', 'Tech Enthusiasts']
    
    for _ in range(num_records):
        start_date = random_date(date(2023, 1, 1), date(2024, 12, 31))
        end_date = start_date + timedelta(days=random.randint(30, 180))
        
        campaign = {
            'campaign_name': f"{fake.company()} {random.choice(['Summer', 'Winter', 'Spring', 'Fall'])} Campaign",
            'start_date': start_date,
            'end_date': end_date,
            'budget': round(Decimal(random.uniform(5000, 100000)), 2),
            'target_audience': random.choice(audiences),
            'channels': random.choice(channels)
        }
        campaigns.append(campaign)
    return campaigns

# Generate website analytics data
def generate_website_analytics(num_records=1000, customer_ids=None):
    analytics = []
    sources = ['Organic Search', 'Direct', 'Social Media', 'Email', 'Paid Search', 'Referral']
    
    for _ in range(num_records):
        analytics.append({
            'customer_id': random.choice(customer_ids) if customer_ids else random.randint(1, 100),
            'session_id': str(uuid.uuid4()),
            'date': fake.date_between(start_date='-1y', end_date='today'),
            'page_views': random.randint(1, 50),
            'session_duration': random.randint(10, 3600),  # 10 seconds to 1 hour
            'bounce_rate': round(random.uniform(0, 100), 2),
            'traffic_source': random.choice(sources)
        })
    return analytics

# Generate social media analytics data
def generate_social_media_analytics(num_records=500, customer_ids=None, campaign_ids=None):
    analytics = []
    platforms = ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok']
    
    for _ in range(num_records):
        analytics.append({
            'customer_id': random.choice(customer_ids) if customer_ids else random.randint(1, 100),
            'campaign_id': random.choice(campaign_ids) if campaign_ids else random.randint(1, 20),
            'platform': random.choice(platforms),
            'date': fake.date_between(start_date='-1y', end_date='today'),
            'impressions': random.randint(100, 1000000),
            'reach': random.randint(50, 500000),
            'engagement': random.randint(10, 50000)
        })
    return analytics

# Generate conversion data
def generate_conversions(num_records=200, customer_ids=None, campaign_ids=None):
    conversions = []
    conversion_types = ['Purchase', 'Newsletter Signup', 'Demo Request', 'Free Trial', 'Consultation']
    
    for _ in range(num_records):
        conversions.append({
            'customer_id': random.choice(customer_ids) if customer_ids else random.randint(1, 100),
            'campaign_id': random.choice(campaign_ids) if campaign_ids else random.randint(1, 20),
            'conversion_type': random.choice(conversion_types),
            'conversion_date': fake.date_between(start_date='-1y', end_date='today'),
            'revenue': round(Decimal(random.uniform(0, 5000)), 2)
        })
    return conversions

def aggregate_campaign_data(campaigns, conversions):
    # Create a dictionary to store totals by target audience
    audience_totals = {}
    
    # Sum up budgets by target audience
    for campaign in campaigns:
        audience = campaign['target_audience']
        budget = float(campaign['budget'])  # Convert from Decimal to float
        
        if audience not in audience_totals:
            audience_totals[audience] = {'budget': 0, 'revenue': 0}
        
        audience_totals[audience]['budget'] += budget
    
    # Calculate revenue (1-1.75 times budget)
    for audience in audience_totals:
        revenue_multiplier = random.uniform(1.0, 1.75)
        audience_totals[audience]['revenue'] = round(audience_totals[audience]['budget'] * revenue_multiplier, 2)
    
    # Convert to array format
    result = [
        {
            "category": audience,
            "budget": totals['budget'],
            "revenue": totals['revenue']
        }
        for audience, totals in audience_totals.items()
    ]
    
    return result

def aggregate_website_analytics(analytics):
    # Create a dictionary to store totals by traffic source
    source_totals = {}
    
    # Sum up metrics by traffic source
    for entry in analytics:
        source = entry['traffic_source']
        
        if source not in source_totals:
            source_totals[source] = {
                'page_views': 0,
                'bounce_rate': 0,
                'session_duration': 0,
                'count': 0  # To calculate average bounce rate
            }
        
        source_totals[source]['page_views'] += entry['page_views']
        source_totals[source]['bounce_rate'] += entry['bounce_rate']
        source_totals[source]['session_duration'] += entry['session_duration']
        source_totals[source]['count'] += 1
    
    # Convert to array format and calculate averages
    result = [
        {
            "traffic_source": source,
            "page_views": totals['page_views'],
            "bounce_rate": round(totals['bounce_rate'] / totals['count'], 2),
            "session_duration": round(totals['session_duration'] / totals['count'], 2)
        }
        for source, totals in source_totals.items()
    ]
    
    return result

def save_to_json():
    try:
        # Create output directory if it doesn't exist
        output_dir = Path('routes/seed_data')
        output_dir.mkdir(exist_ok=True, parents=True)
        
        # Generate data
        print("Generating mock data...")
        customers = generate_customers(100)
        campaigns = generate_campaigns(20)
        
        # Get IDs for related tables
        customer_ids = list(range(1, len(customers) + 1))
        campaign_ids = list(range(1, len(campaigns) + 1))
        
        website_analytics = generate_website_analytics(1000, customer_ids)
        social_media_analytics = generate_social_media_analytics(500, customer_ids, campaign_ids)
        conversions = generate_conversions(200, customer_ids, campaign_ids)
        
        # Generate aggregated data
        campaign_aggregates = aggregate_campaign_data(campaigns, conversions)
        website_analytics_aggregates = aggregate_website_analytics(website_analytics)
        
        # Save each dataset to a separate JSON file
        datasets = {
            'customers': customers,
            'campaigns': campaigns,
            'website_analytics': website_analytics,
            'social_media_analytics': social_media_analytics,
            'conversions': conversions,
            'campaign_aggregates': campaign_aggregates,
            'website_analytics_aggregates': website_analytics_aggregates
        }
        
        for name, data in datasets.items():
            file_path = output_dir / f'{name}.json'
            print(f"Saving {name} to {file_path}...")
            with open(file_path, 'w') as f:
                json.dump(data, f, cls=CustomJSONEncoder, indent=2)
        
        print("Data files created successfully!")
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    save_to_json()
