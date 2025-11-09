"""Add interventions, adherence events, and marketing campaigns tables

Revision ID: 001
Revises:
Create Date: 2025-01-08

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create interventions table
    op.create_table('interventions',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('call_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('patient_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('trigger_type', sa.String(length=50), nullable=True),
        sa.Column('trigger_confidence', sa.Float(), nullable=True),
        sa.Column('trigger_text', sa.String(length=500), nullable=True),
        sa.Column('trigger_timestamp', sa.DateTime(timezone=True), nullable=True),
        sa.Column('intervention_type', sa.String(length=50), nullable=True),
        sa.Column('intervention_applied', sa.Boolean(), nullable=True),
        sa.Column('intervention_timestamp', sa.DateTime(timezone=True), nullable=True),
        sa.Column('intervention_notes', sa.String(length=500), nullable=True),
        sa.Column('outcome_status', sa.String(length=50), nullable=True),
        sa.Column('adherence_30_day', sa.Boolean(), nullable=True),
        sa.Column('adherence_90_day', sa.Boolean(), nullable=True),
        sa.Column('follow_up_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['call_id'], ['calls.id'], ),
        sa.ForeignKeyConstraint(['patient_id'], ['patients.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create adherence_events table
    op.create_table('adherence_events',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('patient_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('event_type', sa.String(length=50), nullable=True),
        sa.Column('event_date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('event_data', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('medication_name', sa.String(length=200), nullable=True),
        sa.Column('days_supply', sa.Integer(), nullable=True),
        sa.Column('adherent', sa.Boolean(), nullable=True),
        sa.Column('notes', sa.String(length=500), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['patient_id'], ['patients.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create marketing_campaigns table
    op.create_table('marketing_campaigns',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('campaign_name', sa.String(length=200), nullable=False),
        sa.Column('campaign_type', sa.String(length=50), nullable=True),
        sa.Column('start_date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('end_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('target_segment', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('message_theme', sa.String(length=200), nullable=True),
        sa.Column('materials_shared', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('patients_reached', sa.Integer(), nullable=True),
        sa.Column('engagement_rate', sa.Float(), nullable=True),
        sa.Column('conversion_rate', sa.Float(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('marketing_campaigns')
    op.drop_table('adherence_events')
    op.drop_table('interventions')
