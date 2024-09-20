import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../config/configEnvs';
import Stream from './stream/Stream';

interface StreamRoom {
  _id: string;
  name: string;
}

const JoinStream: React.FC = () => {
  const [streams, setStreams] = useState<StreamRoom[]>([]);
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');
  const { HOST, SERVICE } = getEnvVariables();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchUserId = async () => {
      const response = await axios.get(`${HOST}${SERVICE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserId(response.data.userId);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchStreams = async () => {
      const response = await axios.get(`${HOST}${SERVICE}/streams`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setStreams(response.data.streams);
    };

    fetchStreams();
  }, []);

  return (
    <div>
      <h1>Unirse a un Stream</h1>
      {streams.map((stream) => (
        <div key={stream._id}>
          <p>{stream.name}</p>
          <button onClick={() => setSelectedStream(stream._id)}>Unirse al stream</button>
        </div>
      ))}
      {selectedStream && <Stream userId={userId} streamId={selectedStream} />}
    </div>
  );
};

export default JoinStream;

