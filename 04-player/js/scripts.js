$(document).ready(async function () {
  const allSongs = (await fetchSongs())?.data;

  const allSongsFormatted = allSongs.map((song) => {
    return {
      ...song,
      lowerCaseName: song.name?.toLowerCase(),
      lowerCaseArtist: song.artist?.toLowerCase(),
    };
  });

  const myFavs = await fetchMyFavs();
  const myFavsMusicIds = myFavs.map((x) => x.musicId);

  const allSongsOrderedByArtist = allSongsFormatted.sort((a, b) =>
    a.artist.localeCompare(b.artist)
  );
  let lastRowSelected = null;

  await populateSongTable(allSongsOrderedByArtist, myFavsMusicIds);

  $('#find-music').click(function (event) {
    event.preventDefault();
    const songOrArtistToFind =
      $('#search-music')?.val()?.trim()?.toLowerCase() || '';

    newAllSongsOrderedByArtist = allSongsOrderedByArtist.filter(
      (song) =>
        song.lowerCaseName?.includes(songOrArtistToFind) ||
        song.lowerCaseArtist?.includes(songOrArtistToFind)
    );

    populateSongTable(newAllSongsOrderedByArtist, myFavsMusicIds);
  });

  $('.play').click(function () {
    const music = $(this).attr('dt-info-m');
    const title = $(this).attr('dt-info-title');
    const artist = $(this).attr('dt-info-artist');

    const songSelected = findSongByNameAndArtist(title, artist, allSongs);
    const rowSelected = $(`#song-${songSelected.id}`)[0];
    const selectedSameRowAsBefore = rowSelected === lastRowSelected;
    const isPlaying = $(this).attr('playing') || false;

    if (selectedSameRowAsBefore && isPlaying) {
      pauseMusic($(this));
      return;
    }

    if (selectedSameRowAsBefore && !isPlaying) {
      resumeMusic($(this));
      return;
    }

    setLastRowNotActive(lastRowSelected);

    const srcMusic = $('#src-music')
      .attr({ src: `./database/${songSelected.songPath}` })
      .clone();
    const srcVideo = $('#src-video')
      .attr({ src: `./database/${songSelected.videoPath}` })
      .clone();

    rowSelected.classList.add('row-active');
    lastRowSelected = rowSelected;

    appendMusicAudioToAudioFooter(srcMusic, songSelected);
    appendVideoToVideoMusicCard(srcVideo);
    appendArticleToVideoCardWithLyricsInformation(songSelected);
    resumeMusic($(this));
  });

  $('.heart').click(function () {
    let isFave = $(this).attr('favourite') === 'true';
    $(this).attr('favourite', !isFave);
    $(this).html(getHeartoIcon(!isFave));
  });
});

function setLastRowNotActive(lastRowSelected) {
  if (!lastRowSelected?.firstElementChild?.firstElementChild) {
    return;
  }
  lastRowSelected?.classList.remove('row-active');
  lastRowSelected.firstElementChild.firstElementChild.innerHTML =
    '<i class="fas fa-play"></i>';
}

function pauseMusic(playTableRowElement) {
  $(playTableRowElement).html('<i class="fas fa-play"></i>');
  $(playTableRowElement).removeAttr('playing');
  $('#audio')[0]?.pause();
  $('video')[0].pause();
}

function resumeMusic(playTableRowElement) {
  $(playTableRowElement).html('<i class="fas fa-pause"></i>');
  $(playTableRowElement).attr({ playing: true });
  $('#audio')[0]?.play();
  $('video')[0].play();
}

function appendMusicAudioToAudioFooter(srcMusic, { name, artist }) {
  $('#audio-music').html('');
  $('<audio id="audio">')
    .attr({ controls: 'controls', autoplay: 'autoplay' })
    .addClass('w-50')
    .html(srcMusic)
    .appendTo('#audio-music');
  $('#title-music').html(name);
  $('#artist-music').html(artist);
}

function appendVideoToVideoMusicCard(srcVideo) {
  $('#video-music').html('');
  $('<video width="320" height="240" muted>')
    .addClass('ms-auto w-100 bg-black')
    .attr({ controls: 'controls', autoplay: 'autoplay' })
    .html(srcVideo)
    .appendTo('#video-music');
}

function appendArticleToVideoCardWithLyricsInformation(song) {
  $('<article class="card-body flex-column overflow-auto bg-gray">')
    .html(lyricsInformationOf(song))
    .appendTo('#video-music');
}

async function fetchSongs() {
  try {
    const res = await fetch('../database/musics.json');
    return await res.json();
  } catch (e) {
    console.error(e);
  }
}

async function fetchMyFavs() {
  try {
    const res = await fetch('../database/myfavs.json');
    return await res.json();
  } catch (e) {
    console.error(e);
  }
}

function getHeartoIcon(myFave = false) {
  return myFave
    ? '<i class="fas fa-heart"></i>'
    : '<i class="far fa-heart"></i>';
}

async function populateSongTable(songs, myFavsMusicIds) {
  let tableBody = '<tbody> ';

  songs.forEach((song) => {
    const isFaveSong = myFavsMusicIds.includes(song.id);
    const heartoIcon = getHeartoIcon(isFaveSong);

    return (tableBody += `<tr class="align-middle text-secondary shadow-sm table-row-effects mx-3" id="song-${song.id}">
          
            <td class="text-center">
              <a role="button" class="play" dt-info-m="${song.artist} - ${song.name}" dt-info-artist="${song.artist}" dt-info-title="${song.name}">
                <i class="fas fa-play"></i>
              </a>
            </td>
            <td class="text-center">
              <a role="button" class="heart" id="heart-${song.id}" favourite="${isFaveSong}">
                ${heartoIcon}
              </a>
            </td>
            <td>${song.name}</td>
            <td>${song.artist}</td>
          
        </tr>`);
  });

  tableBody += ' </tbody>';
  $('#song-table').html(tableBody);

  return songs;
}

function findSongByNameAndArtist(title, artist, songsLibrary) {
  return songsLibrary.find(
    (song) => song.artist === artist && song.name === title
  );
}

function lyricsInformationOf(song) {
  let info = `<h1 class="fs-5 mb-4">Lyrics: ${song?.name} </h1>`;

  if (!song || !song?.lyrics) {
    return info;
  }
  const lyrics = song?.lyrics.find((lyric) => lyric.language === 'en');

  lyrics.paragraphs.forEach((p) => {
    let paragraph = `<p class="card-text" key=${p.id}>`;

    p.lines.forEach((line) => {
      paragraph += `${line} <br /> `;
    });
    paragraph += '<p> ';

    info += paragraph;
  });

  return info;
}
