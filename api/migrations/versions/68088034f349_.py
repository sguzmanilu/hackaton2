"""empty message

Revision ID: 68088034f349
Revises: fea4372cf6cd
Create Date: 2024-05-20 16:50:24.846434

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '68088034f349'
down_revision = 'fea4372cf6cd'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True))
    op.add_column('user', sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user', 'updated_at')
    op.drop_column('user', 'created_at')
    # ### end Alembic commands ###
