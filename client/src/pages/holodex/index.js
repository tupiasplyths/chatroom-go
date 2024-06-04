import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';
import LiveChannels from './channels';

const backend_url = "http://" + process.env.REACT_APP_BACKEND_URL + ":" + process.env.REACT_APP_BACKEND_PORT; 
const holodex_key = process.env.REACT_APP_HOLODEX_API_KEY;
const Holodex = () => {
    const channelString =  useRef('');
    // const [channelString, setChannelString] = useState('');
    const [channelData, setChannelData] = useState(null);

    function updateQueryStringParameter(uri, key, value) {
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
          return uri.replace(re, '$1' + key + "=" + value + '$2');
        }
        else {
          return uri + separator + key + "=" + value;
        }
    }
    useEffect(() => {
        const readTextFile = async () => {
            const response = await fetch(backend_url + '/api/channelID');
            const json = await response.json();
            channelString.current = json.message;
            // setChannelString(json.message);
            console.log("got: " + channelString.current);
        }
        

        const fetchData = async () => {
            await readTextFile();
            let url = updateQueryStringParameter(
                'https://holodex.net/api/v2/users/live', 
                'channels', 
                channelString.current
            );
            console.log('url: ' + url);
            const response = await fetch(
                url, 
                {
                    headers: {
                        'X-APIKEY': holodex_key,
                    }
                }
        );
            const json = await response.json();
            setChannelData(json);
        };
        fetchData();
        console.log(channelData);
    }, []);

    
    return (
        <div className={styles.container}>  
            <h1>Holodex</h1>
            <LiveChannels 
                channeljson = {channelData}
            />
        </div>
    );
};
export default Holodex;