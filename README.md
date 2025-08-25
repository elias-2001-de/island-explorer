# Software-Projekt 2023 Gruppe 02

build the website

```bash
curl -L -o jonah https://github.com/elias-2001-de/jonah/releases/download/v0.1.7/jonah
chmod +x jonah
./jonah project jonah.toml dist
```

then start the server 

```bash
cd dist
python3 -m http.server
```

and go to [http://0.0.0.0:8000/island-explorer/](http://0.0.0.0:8000/island-explorer/)