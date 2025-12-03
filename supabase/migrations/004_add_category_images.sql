-- Add image_url field to menu_categories table
-- This allows categories to have images for the grid-based menu display

ALTER TABLE menu_categories 
ADD COLUMN IF NOT EXISTS image_url TEXT;

