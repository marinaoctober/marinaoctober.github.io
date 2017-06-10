import os
import sqlite3
from flask import Flask, render_template, request, url_for, redirect, make_response

app = Flask(__name__)

def connect_db():
    dbName = os.path.join(app.root_path, 'marina.db')
    db = sqlite3.connect(dbName)
    db.row_factory = sqlite3.Row
    return db

@app.route('/edit', methods=['GET', 'POST'])
def edit_entry():
    if request.method == 'POST':
        db = connect_db()
        db.execute('insert or replace into entries (title, text) values (?, ?)',
                [request.form['title'], request.form['text']])
        db.commit()
        return redirect(url_for('edit_entry', element=request.form['title']))
    else:
        element = request.args.get('element')
        db = connect_db()
        cur = db.execute('select text from entries where title=(?)',
                [element])
        text = cur.fetchone()
        if text:
            text = text[0]
        else:
            text = 'No text'
        return render_template('edit_entry.html', element=element, text=text)

@app.route('/show')
def show_entries():
    elements = request.args.get('element')
    elements = ','.join(["'" + s + "'" for s in elements.split(',')])
    db = connect_db()
    cur = db.execute('select title, text from entries where title in (' + elements + ')')
    entries = cur.fetchall()
    return render_template('show_entries.html', entries=entries)

@app.route('/save')
def save_entries():
    elements = request.args.get('element')
    elements = ','.join(["'" + s + "'" for s in elements.split(',')])
    db = connect_db()
    cur = db.execute('select title, text from entries where title in (' + elements + ')')
    entries = cur.fetchall()

    filetext = ''
    for entry in entries:
        filetext += entry[0] + '\n\n'
        filetext += entry[1] + '\n\n' + '-'*20 + '\n\n'
    response = make_response(filetext)
    response.headers["Content-Disposition"] = "attachment; filename=elements.txt"
    return response

@app.route('/')
def main():
    return render_template('index.html')

if __name__ == "__main__":
        app.run()
