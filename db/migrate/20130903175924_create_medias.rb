class CreateMedias < ActiveRecord::Migration
  def change
    create_table :medias do |t|
      t.string :title
      t.text :description
      t.string :mediaId
      t.date :created 
      t.integer :duration
      t.string :thumbnail
      t.timestamps
    end
  end
end
