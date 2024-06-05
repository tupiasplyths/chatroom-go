import { useEffect, useState } from "react";
import styles from './styles.module.css';
import { IoReloadSharp } from "react-icons/io5";
const LiveChannels = ({ channeljson, setReload }) => {
	const [channels, setChannel] = useState([]);
	// const [imgurl, setImgurl] = useState([]);
	

	const reloadComponent = () => {
		setReload((prev) => prev + 1);
		console.log('reload triggered');
	}
	useEffect(() => {
		if (!channeljson) return
		// console.log("original: " + channeljson)
		// console.log(json)
		let channels = []
		for (let i = 0; i < channeljson.length; i++) {
			// console.log(channeljson[i])
			if (channeljson[i].status === "live") {
				channels.push(channeljson[i]);
				// setChannel((prev) => [...prev, channeljson[i]]);
			};
		}
		console.log("there are " + channels.length + " live channels");
		setChannel(channels);
	}, [channeljson])
	return (
		<div className={styles.channelList}>
			<IoReloadSharp onClick={reloadComponent} className={styles.reloadIcon}/>
			{channels.length > 0 && channels.map((channel, i) => (
				<div className={styles.card} key={i}>
					<div className={styles.cardBody}>
						<li>
							<img 
								src={channel.channel.photo} 
								alt={channel.channel.name} 
								width={180}
								height={180}
							/>
							<div className={styles.channelName}>
								{channel.channel.name}

							</div>
							{/* <p className="card-text">{channel.description}</p> */}
						</li>
					</div>
				</div>)
			)}
		</div>
	)
}

export default LiveChannels;