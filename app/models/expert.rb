class Expert < ActiveRecord::Base
  # attr_accessible :title, :body

  attr_accessible :title, :description, :confirmed,
  :start, :end, :user_id, :expert_id
  has_many :media
  has_many :skills
  belongs_to :user
  has_many :availability_blocks
end
