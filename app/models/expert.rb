class Expert < ActiveRecord::Base
  # attr_accessible :title, :body

  attr_accessible :title, :description, :confirmed,
  :start, :end, :user_id, :expert_id

  has_many :skills_events
  has_many :skills, through: :skills_events
  belongs_to :user
  belongs_to :expert
  has_many :availability_blocks
end
