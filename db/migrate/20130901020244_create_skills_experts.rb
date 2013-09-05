class CreateSkillsExperts < ActiveRecord::Migration
  def change
      create_table :skills_experts, :id => false do |t|
     	 t.integer :skill_id
     	 t.integer :expert_id
    end
  end
end
