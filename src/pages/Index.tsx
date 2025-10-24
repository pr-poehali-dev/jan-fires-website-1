import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState([
    'Jan Fires появился на андеграундной музыкальной сцене с голосом, который воплощает в себе современную душу в сочетании с классической элегантностью. Его уникальное звучание покорило аудитории по всему миру, создавая глубокую связь через каждую ноту.',
    'Родившийся в семье музыкантов, Jan открыл свою страсть к музыке в раннем возрасте. Его путь начался в задымленных джаз-клубах и вырос до концертных залов с аншлагами, где его выступления сочетают необработанную эмоцию с технической точностью.',
    'С множеством альбомов и бесчисленными выступлениями, Jan Fires продолжает раздвигать границы современной музыки, создавая звуковые пейзажи, которые резонируют с человеческим опытом. Его работа — свидетельство силы уязвимости и художественного самовыражения.'
  ]);
  const [tempBioText, setTempBioText] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const AUTHOR_PASSWORD = 'janfires2024';

  useEffect(() => {
    const savedAuth = localStorage.getItem('janfires_auth');
    if (savedAuth === AUTHOR_PASSWORD) {
      setIsAuthorized(true);
    }
  }, [AUTHOR_PASSWORD]);

  const handleLogin = () => {
    if (password === AUTHOR_PASSWORD) {
      setIsAuthorized(true);
      localStorage.setItem('janfires_auth', password);
      setShowAuthDialog(false);
      setPassword('');
      toast({
        title: "Успешно",
        description: "Режим редактирования активирован",
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Неверный пароль",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    localStorage.removeItem('janfires_auth');
    toast({
      title: "Выход",
      description: "Режим редактирования отключён",
    });
  };

  const handleEditBio = () => {
    if (!isAuthorized) {
      setShowAuthDialog(true);
      return;
    }
    setTempBioText([...bioText]);
    setIsEditingBio(true);
  };

  const handleSaveBio = () => {
    setBioText([...tempBioText]);
    setIsEditingBio(false);
    toast({
      title: "Успешно",
      description: "Биография обновлена",
    });
  };

  const handleCancelEditBio = () => {
    setIsEditingBio(false);
    setTempBioText([]);
  };

  const updateBioParagraph = (index: number, value: string) => {
    const updated = [...tempBioText];
    updated[index] = value;
    setTempBioText(updated);
  };

  const [tracks, setTracks] = useState([
    { id: 1, title: 'Полночное эхо', duration: '3:45', album: 'Тени и свет', audioUrl: '' },
    { id: 2, title: 'Золотой час', duration: '4:12', album: 'Тени и свет', audioUrl: '' },
    { id: 3, title: 'Потерянный в переводе', duration: '3:28', album: 'Отголоски', audioUrl: '' },
    { id: 4, title: 'Бархатные мечты', duration: '5:01', album: 'Отголоски', audioUrl: '' },
  ]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      if (currentTrack < tracks.length - 1) {
        setCurrentTrack(currentTrack + 1);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, tracks.length]);

  useEffect(() => {
    if (audioRef.current && tracks[currentTrack]?.audioUrl) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrack, tracks, isPlaying]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (!tracks[currentTrack]?.audioUrl) {
      toast({
        title: "Нет аудио",
        description: "Загрузите аудиофайл для этого трека",
      });
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((error) => {
        console.error('Play error:', error);
        toast({
          title: "Ошибка воспроизведения",
          description: "Не удалось воспроизвести аудио",
          variant: "destructive",
        });
      });
      setIsPlaying(true);
    }
  };

  const handleTrackSelect = (index: number) => {
    setCurrentTrack(index);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const skipTrack = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentTrack < tracks.length - 1) {
      setCurrentTrack(currentTrack + 1);
    } else if (direction === 'prev' && currentTrack > 0) {
      setCurrentTrack(currentTrack - 1);
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAuthorized) {
      setShowAuthDialog(true);
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите аудиофайл",
        variant: "destructive",
      });
      return;
    }

    const audioUrl = URL.createObjectURL(file);
    const updatedTracks = [...tracks];
    updatedTracks[currentTrack] = {
      ...updatedTracks[currentTrack],
      audioUrl,
    };
    setTracks(updatedTracks);

    toast({
      title: "Успешно",
      description: `Трек "${tracks[currentTrack].title}" загружен`,
    });
  };

  const handleUploadClick = () => {
    if (!isAuthorized) {
      setShowAuthDialog(true);
      return;
    }
    fileInputRef.current?.click();
  };

  const galleryImages = [
    'https://cdn.poehali.dev/projects/01cb8376-7f40-4136-8016-7df2bebb9299/files/8a8a8a4e-9ec5-4ee2-8293-eddff954176b.jpg',
    'https://cdn.poehali.dev/projects/01cb8376-7f40-4136-8016-7df2bebb9299/files/ec131a48-e89d-4261-9d05-0c0254c91315.jpg',
    'https://cdn.poehali.dev/projects/01cb8376-7f40-4136-8016-7df2bebb9299/files/50a49fc6-c8e0-441d-839b-54abf1421eb5.jpg',
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-wider text-primary">Jan Fires</h1>
            <div className="flex items-center gap-8">
              {['home', 'bio', 'music', 'gallery'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`golden-underline text-sm uppercase tracking-widest transition-colors ${
                    activeSection === section ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {section === 'home' ? 'Главная' : section === 'bio' ? 'Биография' : section === 'music' ? 'Музыка' : 'Галерея'}
                </button>
              ))}
              <Button
                variant={isAuthorized ? "default" : "outline"}
                size="sm"
                onClick={isAuthorized ? handleLogout : () => setShowAuthDialog(true)}
                className={isAuthorized ? "bg-primary text-primary-foreground" : "border-primary text-primary"}
              >
                <Icon name={isAuthorized ? "LogOut" : "Lock"} className="mr-2" size={16} />
                {isAuthorized ? 'Выйти' : 'Вход'}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-primary">Вход для автора</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Введите пароль для редактирования контента сайта
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="bg-background border-border"
            />
            <Button 
              onClick={handleLogin}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Войти
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background z-10"></div>
        <img
          src="https://cdn.poehali.dev/projects/01cb8376-7f40-4136-8016-7df2bebb9299/files/8a8a8a4e-9ec5-4ee2-8293-eddff954176b.jpg"
          alt="Jan Fires"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="container mx-auto px-6 z-20 text-center animate-fade-in">
          <h2 className="text-7xl md:text-9xl font-bold mb-6 text-primary">Jan Fires</h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 tracking-wide">Голос ночи</p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => scrollToSection('music')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg"
            >
              <Icon name="Play" className="mr-2" size={20} />
              Слушать
            </Button>
            <Button
              onClick={() => scrollToSection('bio')}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 px-8 py-6 text-lg"
            >
              Узнать больше
            </Button>
          </div>
        </div>
      </section>

      <section id="bio" className="py-32 bg-secondary/30">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-6xl font-bold text-primary animate-slide-up">Биография</h2>
            {isAuthorized && !isEditingBio && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditBio}
                className="border-primary text-primary hover:bg-primary/10"
              >
                <Icon name="Edit" className="mr-2" size={16} />
                Редактировать
              </Button>
            )}
            {isEditingBio && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEditBio}
                  className="border-muted-foreground text-muted-foreground"
                >
                  <Icon name="X" className="mr-2" size={16} />
                  Отмена
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveBio}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Icon name="Check" className="mr-2" size={16} />
                  Сохранить
                </Button>
              </div>
            )}
          </div>
          
          {!isEditingBio ? (
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              {bioText.map((paragraph, index) => (
                <p key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {tempBioText.map((paragraph, index) => (
                <Textarea
                  key={index}
                  value={paragraph}
                  onChange={(e) => updateBioParagraph(index, e.target.value)}
                  className="min-h-[120px] bg-background border-border text-foreground text-lg leading-relaxed"
                  placeholder={`Параграф ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="music" className="py-32">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-6xl font-bold mb-12 text-center text-primary">Музыка</h2>
          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <div className="space-y-2 mb-8">
                {tracks.map((track, index) => (
                  <div
                    key={track.id}
                    onClick={() => handleTrackSelect(index)}
                    className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all ${
                      currentTrack === index
                        ? 'bg-primary/20 border border-primary'
                        : 'hover:bg-muted/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant={currentTrack === index && isPlaying ? 'default' : 'ghost'}
                          className={currentTrack === index && isPlaying ? 'bg-primary text-primary-foreground' : ''}
                        >
                          <Icon name={currentTrack === index && isPlaying ? 'Pause' : 'Play'} size={18} />
                        </Button>
                        {track.audioUrl && (
                          <div className="w-2 h-2 rounded-full bg-primary" title="Аудио загружено"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{track.title}</h3>
                        <p className="text-sm text-muted-foreground">{track.album}</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{track.duration}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground">{tracks[currentTrack].title}</h3>
                    <p className="text-sm text-muted-foreground">{tracks[currentTrack].album}</p>
                  </div>
                  {isAuthorized && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleUploadClick}
                      className="border-primary text-primary hover:bg-primary/10"
                    >
                      <Icon name="Upload" className="mr-2" size={16} />
                      Загрузить аудио
                    </Button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                <audio ref={audioRef} className="hidden">
                  {tracks[currentTrack]?.audioUrl && (
                    <source src={tracks[currentTrack].audioUrl} type="audio/mpeg" />
                  )}
                </audio>

                <div className="mb-4">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => skipTrack('prev')}
                    disabled={currentTrack === 0}
                  >
                    <Icon name="SkipBack" size={24} />
                  </Button>
                  <Button 
                    size="icon" 
                    onClick={togglePlayPause}
                    className="w-14 h-14 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Icon name={isPlaying ? 'Pause' : 'Play'} size={28} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => skipTrack('next')}
                    disabled={currentTrack === tracks.length - 1}
                  >
                    <Icon name="SkipForward" size={24} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="gallery" className="py-32 bg-secondary/30">
        <div className="container mx-auto px-6">
          <h2 className="text-6xl font-bold mb-12 text-center text-primary">Галерея</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="aspect-square overflow-hidden rounded-lg group cursor-pointer"
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4 text-primary">Jan Fires</h3>
          <div className="flex justify-center gap-6 mb-6">
            <Button variant="ghost" size="icon" className="hover:text-primary">
              <Icon name="Music" size={24} />
            </Button>
            <Button variant="ghost" size="icon" className="hover:text-primary">
              <Icon name="Instagram" size={24} />
            </Button>
            <Button variant="ghost" size="icon" className="hover:text-primary">
              <Icon name="Youtube" size={24} />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 Jan Fires. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;