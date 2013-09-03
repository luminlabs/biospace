class CreateSkillsExperts < ActiveRecord::Migration
  def change
    create_table :skills_experts do |t|

      t.timestamps
    end
  end
end
