#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re
from pathlib import Path
from jinja2 import Template

def clean_filename_for_title(filename):
    """Konvertiert Dateinamen in lesbare Titel"""
    # Entferne .mermaid Endung
    name = filename.replace('.mermaid', '')
    
    # Füge Leerzeichen vor Großbuchstaben ein (CamelCase)
    name = re.sub(r'([a-z])([A-Z])', r'\1 \2', name)
    
    return name

def create_anchor(title):
    """Erstellt einen Anker für die Navigation"""
    return re.sub(r'[^a-zA-Z0-9]', '-', title.lower()).strip('-')

def read_mermaid_files(directory):
    """Liest alle .mermaid Dateien aus einem Verzeichnis"""
    diagrams = []
    
    if not os.path.exists(directory):
        print(f"Warnung: Verzeichnis {directory} nicht gefunden")
        return diagrams
    
    mermaid_files = [f for f in os.listdir(directory) if f.endswith('.mermaid')]
    mermaid_files.sort()  # Alphabetisch sortieren
    
    for filename in mermaid_files:
        filepath = os.path.join(directory, filename)
        
        try:
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read().strip()
                
                title = clean_filename_for_title(filename)
                anchor = create_anchor(title)
                
                diagrams.append({
                    'title': title,
                    'anchor': anchor,
                    'content': content,
                    'filename': filename
                })
                
                print(f"✓ Gelesen: {filename} -> {title}")
                
        except Exception as e:
            print(f"Fehler beim Lesen von {filename}: {e}")
    
    return diagrams

def generate_html():
    """Generiert die finale HTML-Datei"""
    
    # Template laden
    template_path = 'template.html'
    if not os.path.exists(template_path):
        print(f"Fehler: Template {template_path} nicht gefunden")
        return
    
    with open(template_path, 'r', encoding='utf-8') as file:
        template_content = file.read()
    
    template = Template(template_content)
    
    # Mermaid-Dateien einlesen
    class_diagrams = read_mermaid_files('ClassDiagram')
    sequence_diagrams = read_mermaid_files('SequenceDiagram')
    
    # Überprüfen ob Dateien gefunden wurden
    if not class_diagrams and not sequence_diagrams:
        print("Warnung: Keine Mermaid-Dateien gefunden!")
    
    print(f"\nGefunden:")
    print(f"- {len(class_diagrams)} Klassendiagramme")
    print(f"- {len(sequence_diagrams)} Sequenzdiagramme")
    
    # HTML generieren
    html_content = template.render(
        class_diagrams=class_diagrams,
        sequence_diagrams=sequence_diagrams
    )
    
    # In index.html schreiben
    output_path = 'index.html'
    with open(output_path, 'w', encoding='utf-8') as file:
        file.write(html_content)
    
    print(f"\n✅ {output_path} wurde erfolgreich generiert!")
    print(f"📁 Dateigröße: {os.path.getsize(output_path)} Bytes")
    
    # Zusammenfassung
    total_diagrams = len(class_diagrams) + len(sequence_diagrams)
    if total_diagrams > 0:
        print(f"\n📊 Insgesamt {total_diagrams} Diagramme eingebettet:")
        
        if class_diagrams:
            print(f"\n📋 Klassendiagramme:")
            for diagram in class_diagrams:
                print(f"   • {diagram['title']}")
        
        if sequence_diagrams:
            print(f"\n🔄 Sequenzdiagramme:")
            for diagram in sequence_diagrams:
                print(f"   • {diagram['title']}")

if __name__ == "__main__":
    print("🚀 Starte HTML-Generierung mit Mermaid-Diagrammen...")
    print("=" * 50)
    
    generate_html()
    
    print("=" * 50)
    print("✨ Fertig! Du kannst jetzt index.html im Browser öffnen.")