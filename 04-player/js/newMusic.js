async function submitNewMusic(event) {
  event.preventDefault();

  const dbResponse = await fetchFromMusicDataBase();
  const nextId = dbResponse.nextId;
  const musics = dbResponse.data;

  const newMusic = createNewMusicObject(nextId);

  const newMusicList = [...musics, newMusic];
  const newNextId = nextId + 1;

  const newDbData = {
    nextId: newNextId,
    data: newMusicList,
  };
  console.log(newDbData);
}

async function fetchFromMusicDataBase() {
  try {
    const res = await fetch('../database/musics.json');
    return await res.json();
  } catch (e) {
    console.error(e);
  }
}

function createNewMusicObject(id) {
  const name = document.getElementById('name')?.value;
  const artist = document.getElementById('artist')?.value;
  const songPath = document.getElementById('song-path')?.value || '';
  const videoPath = document.getElementById('video-path')?.value || '';
  const language = document.getElementById('lyrics-language')?.value || 'en';
  const letra = document.getElementById('lyrics-area')?.value;

  validateInputs(name, artist, letra);

  const paragraphs = letra.split('\n\n');
  const numberOfParagraphs = paragraphs.length;

  const lyric = new Lyrics(language);
  for (let i = 0; i < numberOfParagraphs; i++) {
    const paragraph = new Paragraph(i + 1);

    const lines = paragraphs[i].split('\n');
    lines.forEach((line) => paragraph.addLine(line));

    lyric.addParagraph(paragraph);
  }

  const music = new Music(id, name, artist, songPath, videoPath);
  music.addLyrics(lyric);

  return music;
}

function insert(music) {}

function validateInputs(name, artist, letra) {
  let erro = '';

  if (!name || name.trim() === '') {
    erro += 'Missing Name. ';
  }

  if (!artist || artist.trim() === '') {
    erro += 'Missing Artist. ';
  }

  if (!letra || letra.trim() === '') {
    erro += 'Missing Lyrics. ';
  }

  if (erro && erro.trim() !== '') {
    return alert(erro);
  }
}

class Music {
  constructor(id, name, artist, songPath = '', videoPath = '') {
    this.id = id;
    this.name = name;
    this.artist = artist;
    this.songPath = songPath;
    this.videoPath = videoPath;
    this.lyrics = [];
  }

  addLyrics(lyric) {
    this.lyrics.push(lyric);
  }
}

class Lyrics {
  constructor(language) {
    this.language = language;
    this.paragraphs = [];
  }

  addParagraph(paragraph) {
    this.paragraphs.push(paragraph);
  }
}

class Paragraph {
  constructor(id) {
    this.id = id;
    this.lines = [];
  }

  addLine(line) {
    this.lines.push(line);
  }
}
