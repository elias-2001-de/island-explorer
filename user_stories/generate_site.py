#!/usr/bin/env python3
import json
from jinja2 import Template
import os

def generate_static_site(json_file_path, output_file='index.html', template_file='template.html'):
    """
    Generate a static HTML site from user stories JSON data
    """
    
    # Load the JSON data
    with open(json_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # HTML template using Jinja2
    with open(template_file, 'r', encoding='utf-8') as f:
        template_str = f.read() 
    
    # Calculate statistics
    total_sprints = len(data)
    total_stories = sum(len(sprint.get('User Storys', [])) for sprint in data.values())
    total_points = 0
    
    for sprint in data.values():
        for story in sprint.get('User Storys', []):
            try:
                points = story.get('Punktzahl', 0)
                if isinstance(points, str) and points != '-':
                    total_points += float(points)
                elif isinstance(points, (int, float)) and points != 0:
                    total_points += points
            except (ValueError, TypeError):
                pass
    
    # Create Jinja2 template
    template = Template(template_str)
    
    # Render the template
    html_output = template.render(
        sprints=data,
        total_sprints=total_sprints,
        total_stories=total_stories,
        total_points=int(total_points)
    )
    
    # Write to output file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html_output)
    
    print(f"Static site generated successfully: {output_file}")

if __name__ == "__main__":
    # Usage example
    # Make sure to save your JSON data as 'user_stories.json'
    json_file = "user_stories.json"
    
    if os.path.exists(json_file):
        generate_static_site(json_file)
    else:
        print(f"JSON file '{json_file}' not found. Please create it with your user stories data.")
        print("Example usage:")
        print("1. Save your JSON data as 'user_stories.json'")
        print("2. Run: python generate_site.py")
        print("3. Open 'index.html' in your browser")