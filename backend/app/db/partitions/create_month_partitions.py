
import os
import sys
from sqlalchemy import create_engine, text
from datetime import datetime, timedelta

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

from app.core.config import settings

def create_monthly_partitions():
    """Creates monthly partitions for the messages and comments tables."""
    engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)
    with engine.connect() as connection:
        for table_name in ["messages", "comments"]:
            # Ensure a partition for the current month exists
            current_month = datetime.utcnow().replace(day=1)
            partition_name = f"{table_name}_{current_month.strftime('%Y%m')}"
            start_date = current_month.strftime('%Y-%m-01')
            next_month_for_end_date = current_month + timedelta(days=32)
            end_date = next_month_for_end_date.replace(day=1).strftime('%Y-%m-01')

            # Use "IF NOT EXISTS" to prevent errors if the partition already exists
            create_partition_sql = text(f"""
                CREATE TABLE IF NOT EXISTS {partition_name} PARTITION OF {table_name}
                FOR VALUES FROM ('{start_date}') TO ('{end_date}');
            """)
            connection.execute(create_partition_sql)
            print(f"Ensured partition exists: {partition_name}")

            # Get the last partition date to create future partitions
            get_last_partition_sql = text(f"""
                SELECT parent.relname as parent_table, child.relname as partition_name
                FROM pg_inherits
                JOIN pg_class parent ON pg_inherits.inhparent = parent.oid
                JOIN pg_class child ON pg_inherits.inhrelid = child.oid
                WHERE parent.relname = '{table_name}'
                ORDER BY child.relname DESC
                LIMIT 1;
            """)
            last_partition = connection.execute(get_last_partition_sql).fetchone()

            if last_partition:
                # Extract the date from the partition name
                last_partition_date_str = last_partition.partition_name.split('_')[-1]
                last_partition_date = datetime.strptime(last_partition_date_str, '%Y%m')
                next_month = last_partition_date + timedelta(days=32)
                next_month = next_month.replace(day=1)
            else:
                # If no partitions exist, start with the next month
                next_month = (datetime.utcnow().replace(day=1) + timedelta(days=32)).replace(day=1)

            # Create partitions for the next 12 months
            for _ in range(12):
                partition_name = f"{table_name}_{next_month.strftime('%Y%m')}"
                start_date = next_month.strftime('%Y-%m-01')
                next_month_for_end_date = next_month + timedelta(days=32)
                end_date = next_month_for_end_date.replace(day=1).strftime('%Y-%m-01')

                create_partition_sql = text(f"""
                    CREATE TABLE IF NOT EXISTS {partition_name} PARTITION OF {table_name}
                    FOR VALUES FROM ('{start_date}') TO ('{end_date}');
                """)
                connection.execute(create_partition_sql)
                print(f"Created partition: {partition_name}")

                next_month = next_month_for_end_date.replace(day=1)

if __name__ == "__main__":
    create_monthly_partitions()
