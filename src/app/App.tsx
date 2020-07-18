import React, { FunctionComponent, useState, useEffect } from 'react';
import './App.css';
import { Channel } from './App.model';
import { API_KEY } from '../config/conf';

const channels: Channel[] = [
  { username: '@dminews',                           img: '', subscribers: 0 },
  { username: '@fisicact',                          img: '', subscribers: 0 },
  { username: '@dieeinews',                         img: '', subscribers: 0 },
  { username: '@deinews',                           img: '', subscribers: 0 },
  { username: '@infoDSC',                           img: '', subscribers: 0 },
  { username: '@lexunictnews',                      img: '', subscribers: 0 },
  { username: '@biogeonews',                        img: '', subscribers: 0 },
  { username: '@biometecnews',                      img: '', subscribers: 0 },
  { username: '@dspsnews',                          img: '', subscribers: 0 },
  { username: '@disumnews',                         img: '', subscribers: 0 },
  { username: '@medicina_unict',                    img: '', subscribers: 0 },
  { username: '@disfornews',                        img: '', subscribers: 0 },
  { username: '@medclinnews',                       img: '', subscribers: 0 },
  { username: '@dgfinews',                          img: '', subscribers: 0 },
  { username: '@dsfnews',                           img: '', subscribers: 0 },
  { username: '@sdslinguenews',                     img: '', subscribers: 0 },
  { username: '@dicarnews',                         img: '', subscribers: 0 },
  { username: '@ersunews',                          img: '', subscribers: 0 },
  { username: '@bio_unict',                         img: '', subscribers: 0 },
  { username: '@geo_unict',                         img: '', subscribers: 0 },
  { username: '@scienze_ambientali',                img: '', subscribers: 0 },
  { username: '@terapia_unict',                     img: '', subscribers: 0 },
  { username: '@Servizio_Sociale_Sociologia_news',  img: '', subscribers: 0 },
  { username: '@lettere_unict',                     img: '', subscribers: 0 },
  { username: '@filosofia_unict',                   img: '', subscribers: 0 },
  { username: '@IngInfoNews',                       img: '', subscribers: 0 },
  { username: '@IngEleNews',                        img: '', subscribers: 0 },
  { username: '@IngIndNews',                        img: '', subscribers: 0 },
  { username: '@Spotted_DMI',                       img: '', subscribers: 0 },
];

export const App: FunctionComponent = () => {
  const [_channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const promises: Promise<any>[] = [];
  const promisesPicture: Promise<any>[] = [];

  const getChannelMembers = (idx: number): void => {
    // get photo
    promises.push(fetch(`https://api.telegram.org/bot${API_KEY}/getChat?chat_id=${channels[idx].username}`)
    .then(r => r.json())
    .then((data) => {

      // get FILE_PATH
      promisesPicture.push(fetch(`https://api.telegram.org/bot${API_KEY}/getFile?file_id=${data.result.photo.big_file_id}`)
      .then(res => res.json())
      // update image path
      .then(data => {
        channels[idx].img = `https://api.telegram.org/file/bot${API_KEY}/${data.result.file_path}`;
        setChannels(channels);
      }));
    }));

    // get members per channel
    promises.push(fetch(`https://api.telegram.org/bot${API_KEY}/getChatMembersCount?chat_id=${channels[idx].username}`)
    .then(r => r.json())
    .then((data) => {
      channels[idx].subscribers = data.result;
      setChannels(channels);
    }));
  }


  useEffect((): void => {
    channels.map((c, idx) => getChannelMembers(idx));
    Promise.all(promises).then(() => 
      Promise.all(promisesPicture).then(() => {
        console.log('finished');
        channels.sort(compare);
        setChannels([...channels]);
        setLoading(true);
      })
    );
  }, []);

  return (
    <div className="App">
      <header className="App-header">
      {
        loading
        ? <table className="App-list">
          <tbody>
          { _channels.map((c, idx) =>
            <tr key={idx}>
              <td><img src={c.img} alt={c.username} width="64" height="64" /></td>
              <td><a className="App-link" href={`https://t.me/${c.username.replace('@', '')}`}>{c.username}</a></td>
              <td>{c.subscribers}</td>
            </tr>)
            }
          </tbody>
        </table>
        : <h2>...loading...</h2>
    }

      </header>
    </div>
  );
}


export function compare(a: Channel, b: Channel): number {
  if (a.subscribers < b.subscribers) {
    return 1;
  }

  if (a.subscribers > b.subscribers) {
    return -1;
  }

  return 0;
}
