class Media < ActiveRecord::Base
  attr_accessible :title,:description,:mediaId,:created,:duration, :thumbnail 
  has_one :expert
  
end
