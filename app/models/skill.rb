class Skill < ActiveRecord::Base
  # attr_accessible :title, :body
  def change
    create_table :skills do |t|
      t.string :tag

      t.timestamps
    end
  end
end
