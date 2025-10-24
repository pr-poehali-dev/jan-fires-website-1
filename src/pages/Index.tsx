import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [currentTrack, setCurrentTrack] = useState(0);

  const tracks = [
    { id: 1, title: 'Полночное эхо', duration: '3:45', album: 'Тени и свет' },
    { id: 2, title: 'Золотой час', duration: '4:12', album: 'Тени и свет' },
    { id: 3, title: 'Потерянный в переводе', duration: '3:28', album: 'Отголоски' },
    { id: 4, title: 'Бархатные мечты', duration: '5:01', album: 'Отголоски' },
  ];

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
            <div className="flex gap-8">
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
            </div>
          </div>
        </div>
      </nav>

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
          <h2 className="text-6xl font-bold mb-12 text-center text-primary animate-slide-up">Биография</h2>
          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p className="animate-fade-in">
              Jan Fires появился на андеграундной музыкальной сцене с голосом, который воплощает в себе
              современную душу в сочетании с классической элегантностью. Его уникальное звучание покорило
              аудитории по всему миру, создавая глубокую связь через каждую ноту.
            </p>
            <p className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Родившийся в семье музыкантов, Jan открыл свою страсть к музыке в раннем возрасте. Его путь
              начался в задымленных джаз-клубах и вырос до концертных залов с аншлагами, где его выступления
              сочетают необработанную эмоцию с технической точностью.
            </p>
            <p className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              С множеством альбомов и бесчисленными выступлениями, Jan Fires продолжает раздвигать границы
              современной музыки, создавая звуковые пейзажи, которые резонируют с человеческим опытом. Его
              работа — свидетельство силы уязвимости и художественного самовыражения.
            </p>
          </div>
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
                    onClick={() => setCurrentTrack(index)}
                    className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all ${
                      currentTrack === index
                        ? 'bg-primary/20 border border-primary'
                        : 'hover:bg-muted/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Button
                        size="icon"
                        variant={currentTrack === index ? 'default' : 'ghost'}
                        className={currentTrack === index ? 'bg-primary text-primary-foreground' : ''}
                      >
                        <Icon name={currentTrack === index ? 'Pause' : 'Play'} size={18} />
                      </Button>
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
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{tracks[currentTrack].title}</h3>
                    <p className="text-sm text-muted-foreground">{tracks[currentTrack].album}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{tracks[currentTrack].duration}</span>
                </div>

                <div className="w-full bg-muted rounded-full h-2 mb-4">
                  <div className="bg-primary h-2 rounded-full w-1/3"></div>
                </div>

                <div className="flex items-center justify-center gap-6">
                  <Button variant="ghost" size="icon">
                    <Icon name="SkipBack" size={24} />
                  </Button>
                  <Button size="icon" className="w-14 h-14 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Icon name="Play" size={28} />
                  </Button>
                  <Button variant="ghost" size="icon">
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