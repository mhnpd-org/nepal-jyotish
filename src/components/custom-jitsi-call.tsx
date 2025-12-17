"use client";

import React, { useEffect, useRef, useState } from "react";

// We'll dynamically load JitsiMeetJS
declare global {
  interface Window {
    JitsiMeetJS: any;
  }
}

interface CustomJitsiCallProps {
  displayName: string;
  roomName: string;
  onLeave?: () => void;
  autoStart?: boolean;
}
export default function CustomJitsiCall({ displayName, roomName, onLeave, autoStart = false }: CustomJitsiCallProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<HTMLDivElement>(null);

  const [jitsiLoaded, setJitsiLoaded] = useState(false);
  const [connection, setConnection] = useState<any>(null);
  const [conference, setConference] = useState<any>(null);
  const [localTracks, setLocalTracks] = useState<any[]>([]);
  const [_, setRemoteTracks] = useState<Map<string, any>>(new Map());
  const [isMuted, setIsMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [participantCount, setParticipantCount] = useState(0);

  // Load Jitsi Meet library
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadJitsi = async () => {
      try {
        // Load lib-jitsi-meet script
        if (!window.JitsiMeetJS) {
          const script = document.createElement('script');
          script.src = 'https://meet.jit.si/libs/lib-jitsi-meet.min.js';
          script.async = true;
          script.onload = () => {
            // Initialize JitsiMeetJS
            window.JitsiMeetJS.init({
              disableAudioLevels: true,
            });
            window.JitsiMeetJS.setLogLevel(window.JitsiMeetJS.logLevels.ERROR);
            console.log(`Using LJM version ${window.JitsiMeetJS.version}!`);
            setJitsiLoaded(true);
          };
          script.onerror = () => {
            setError('Jitsi लाइब्रेरी लोड गर्न सकेन');
          };
          document.head.appendChild(script);
        } else {
          window.JitsiMeetJS.init({
            disableAudioLevels: true,
          });
          window.JitsiMeetJS.setLogLevel(window.JitsiMeetJS.logLevels.ERROR);
          setJitsiLoaded(true);
        }
      } catch (err) {
        console.error('Failed to load Jitsi:', err);
        setError('भिडियो कल सुरु गर्न सकेन');
      }
    };

    loadJitsi();
  }, []);

  // Auto-start call if enabled
  useEffect(() => {
    if (autoStart && jitsiLoaded && !connection && !conference && !isConnecting) {
      joinCall();
    }
  }, [autoStart, jitsiLoaded, connection, conference, isConnecting]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [conference, connection, localTracks]);

  const cleanup = () => {
    localTracks.forEach(track => {
      try {
        track.dispose();
      } catch (err) {
        console.error('Error disposing track:', err);
      }
    });
    
    if (conference) {
      try {
        conference.leave();
      } catch (err) {
        console.error('Error leaving conference:', err);
      }
    }
    
    if (connection) {
      try {
        connection.disconnect();
      } catch (err) {
        console.error('Error disconnecting:', err);
      }
    }
  };

  const joinCall = async () => {
    if (!jitsiLoaded || !window.JitsiMeetJS) {
      setError('Jitsi अझै लोड भएको छैन');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const domain = "meet.jit.si";
      
      // Build connection options following official guide
      const options = {
        hosts: {
          domain: domain,
          muc: `conference.${domain}`,
          focus: `focus.${domain}`,
        },
        serviceUrl: `wss://${domain}/xmpp-websocket?room=${roomName}`,
        websocketKeepAliveUrl: `https://${domain}/_unlock?room=${roomName}`,
      };

      const conn = new window.JitsiMeetJS.JitsiConnection(null, null, options);

      conn.addEventListener(
        window.JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
        () => onConnectionSuccess(conn)
      );

      conn.addEventListener(
        window.JitsiMeetJS.events.connection.CONNECTION_FAILED,
        (error: any) => {
          console.error('Connection failed:', error);
          setError('कनेक्शन असफल भयो। कृपया HTTPS डोमेनमा प्रयास गर्नुहोस्।');
          setIsConnecting(false);
        }
      );

      conn.addEventListener(
        window.JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
        () => {
          console.log('Connection disconnected');
          setIsConnecting(false);
        }
      );

      conn.connect();
      setConnection(conn);
    } catch (err) {
      console.error('Failed to join call:', err);
      setError('कल जोइन गर्न सकेन');
      setIsConnecting(false);
    }
  };

  const onConnectionSuccess = async (conn: any) => {
    try {
      // Initialize conference
      const conf = conn.initJitsiConference(roomName, {
        openBridgeChannel: true,
        startWithAudioMuted: false,
        startWithVideoMuted: false,
      });

      conf.setDisplayName(displayName);

      // Setup event listeners following official guide
      conf.on(window.JitsiMeetJS.events.conference.CONFERENCE_JOINED, () => {
        console.log('Conference joined successfully');
        setIsConnecting(false);
      });

      // Track added
      conf.on(window.JitsiMeetJS.events.conference.TRACK_ADDED, (track: any) => {
        if (!track.isLocal()) {
          handleTrackAdded(track);
        }
      });

      // Track removed
      conf.on(window.JitsiMeetJS.events.conference.TRACK_REMOVED, (track: any) => {
        if (!track.isLocal()) {
          handleTrackRemoved(track);
        }
      });

      // User left
      conf.on(window.JitsiMeetJS.events.conference.USER_LEFT, (id: string) => {
        const container = document.getElementById(`participant-${id}`);
        if (container) container.remove();
        
        setRemoteTracks(prev => {
          const newMap = new Map(prev);
          newMap.delete(id);
          return newMap;
        });
        
        setParticipantCount(prev => Math.max(0, prev - 1));
      });

      // User joined
      conf.on(window.JitsiMeetJS.events.conference.USER_JOINED, (id: string) => {
        console.log('User joined:', id);
        setParticipantCount(prev => prev + 1);
      });

      setConference(conf);

      // Create local tracks
      const tracks = await window.JitsiMeetJS.createLocalTracks({
        devices: ['audio', 'video'],
      });

      setLocalTracks(tracks);

      // Add local tracks before joining (as per official guide)
      for (const track of tracks) {
        await conf.addTrack(track);
        if (track.getType() === 'video' && localVideoRef.current) {
          track.attach(localVideoRef.current);
        }
      }

      // Join the conference
      await conf.join();

    } catch (err) {
      console.error('Failed to join conference:', err);
      setError('कन्फरेन्समा जोइन गर्न सकेन');
      setIsConnecting(false);
    }
  };

  // Handle track added (following official guide)
  const handleTrackAdded = (track: any) => {
    const participantId = track.getParticipantId();
    const trackType = track.getType();

    setRemoteTracks(prev => {
      const newMap = new Map(prev);
      if (!newMap.has(participantId)) {
        newMap.set(participantId, []);
      }
      newMap.get(participantId)!.push(track);
      return newMap;
    });

    if (trackType === 'video') {
      let container = document.getElementById(`participant-${participantId}`);
      if (!container && remoteVideosRef.current) {
        container = document.createElement('div');
        container.id = `participant-${participantId}`;
        container.className = 'relative bg-gray-800 rounded-lg overflow-hidden aspect-video';
        remoteVideosRef.current.appendChild(container);
      }

      const videoNode = document.createElement('video');
      videoNode.id = track.getId();
      videoNode.className = 'w-full h-full object-cover rounded-lg';
      videoNode.autoplay = true;
      
      if (container) {
        container.appendChild(videoNode);
        track.attach(videoNode);
      }
    } else {
      // Audio track
      const audioNode = document.createElement('audio');
      audioNode.id = track.getId();
      audioNode.autoplay = true;
      document.body.appendChild(audioNode);
      track.attach(audioNode);
    }
  };

  // Handle track removed (following official guide)
  const handleTrackRemoved = (track: any) => {
    track.dispose();
    const element = document.getElementById(track.getId());
    if (element) {
      element.remove();
    }
  };

  const toggleMute = () => {
    localTracks.forEach(track => {
      if (track.getType() === 'audio') {
        if (isMuted) {
          track.unmute();
        } else {
          track.mute();
        }
      }
    });
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    localTracks.forEach(track => {
      if (track.getType() === 'video') {
        if (videoOff) {
          track.unmute();
        } else {
          track.mute();
        }
      }
    });
    setVideoOff(!videoOff);
  };

  const leaveCall = () => {
    cleanup();
    setLocalTracks([]);
    setRemoteTracks(new Map());
    setConference(null);
    setConnection(null);
    setIsConnecting(false);
    setParticipantCount(0);
    
    if (onLeave) {
      onLeave();
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 text-rose-600 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">त्रुटि</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              if (onLeave) onLeave();
            }}
            className="px-6 py-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-semibold rounded-lg hover:from-rose-700 hover:to-orange-700 transition-all"
          >
            पछाडि जानुहोस्
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Video Grid */}
      <div className="flex-1 p-2 md:p-4 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 h-full">
          {/* Local Video */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 px-3 py-1 rounded-full">
              <span className="text-white text-xs md:text-sm font-medium">तपाईं ({displayName})</span>
            </div>
            {videoOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-rose-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-2xl md:text-3xl font-bold">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs md:text-sm">भिडियो बन्द छ</p>
                </div>
              </div>
            )}
          </div>

          {/* Remote Videos Container */}
          <div ref={remoteVideosRef} className="contents" />

          {/* Empty state when no participants */}
          {!conference && !isConnecting && (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-100 to-orange-100 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">मिटिङमा सामेल हुनुहोस्</h3>
                <p className="text-gray-400 text-sm mb-6">तपाईंको भिडियो परामर्श सुरु गर्न तयार छ</p>
                <button
                  onClick={joinCall}
                  disabled={!jitsiLoaded}
                  className="px-8 py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold rounded-lg hover:from-rose-700 hover:to-orange-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!jitsiLoaded ? 'लोड हुँदैछ...' : '🎥 कल सुरु गर्नुहोस्'}
                </button>
              </div>
            </div>
          )}

          {isConnecting && (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent mb-4"></div>
                <p className="text-white font-medium">जोडिँदै छ...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      {conference && (
        <div className="bg-gray-800 border-t border-gray-700 px-4 py-3 md:py-4">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {/* Mute/Unmute */}
            <button
              onClick={toggleMute}
              className={`p-3 md:p-4 rounded-full transition-all ${
                isMuted
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title={isMuted ? 'अनम्यूट गर्नुहोस्' : 'म्यूट गर्नुहोस्'}
            >
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>

            {/* Video On/Off */}
            <button
              onClick={toggleVideo}
              className={`p-3 md:p-4 rounded-full transition-all ${
                videoOff
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title={videoOff ? 'भिडियो अन गर्नुहोस्' : 'भिडियो बन्द गर्नुहोस्'}
            >
              {videoOff ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>

            {/* Leave Call */}
            <button
              onClick={leaveCall}
              className="p-3 md:p-4 rounded-full bg-red-600 hover:bg-red-700 transition-all"
              title="कल छोड्नुहोस्"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
              </svg>
            </button>

            {/* Participant count */}
            <div className="hidden md:flex items-center gap-2 ml-4 px-4 py-2 bg-gray-700 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-white text-sm font-medium">
                {participantCount + 1} जना
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
