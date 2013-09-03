class CreateExperts < ActiveRecord::Migration
  def change
    create_table :experts do |t|
      t.string  :title
      t.string  :company
      t.string  :linkedin
      t.string  :photo
      t.integer :user_id
      t.boolean :active, {default: false}
      t.timestamps
    end
  end
end

