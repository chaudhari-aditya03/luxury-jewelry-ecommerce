import React from 'react';
import { Carousel, Button, Typography } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const HeroCarousel = () => {
    const slides = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop', // Gold necklace
            title: 'Timeless Elegance',
            subtitle: 'Discover our exquisite collection of handcrafted gold jewelry.',
            link: '/shop?category=necklaces'
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1603561596112-0a132b72231d?q=80&w=2070&auto=format&fit=crop', // Diamond ring
            title: 'Forever Yours',
            subtitle: 'Celebrate love with our premium diamond engagement rings.',
            link: '/shop?category=rings'
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop', // Luxury set
            title: 'Modern Luxury',
            subtitle: 'Redefining sophistication with our latest modern designs.',
            link: '/shop'
        }
    ];

    const contentStyle = {
        height: '600px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
        position: 'relative',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    const overlayStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
    };

    return (
        <Carousel autoplay effect="fade" accessibility={false}>
            {slides.map(slide => (
                <div key={slide.id}>
                    <div style={{ ...contentStyle, backgroundImage: `url(${slide.image})` }}>
                        <div style={overlayStyle}>
                            <Title level={1} style={{ color: '#fff', fontSize: '3.5rem', marginBottom: 16, fontFamily: "'Playfair Display', serif" }}>
                                {slide.title}
                            </Title>
                            <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.25rem', maxWidth: 600, marginBottom: 32 }}>
                                {slide.subtitle}
                            </Paragraph>
                            <Link to={slide.link}>
                                <Button type="primary" size="large" style={{ height: 50, padding: '0 40px', fontSize: 16 }}>
                                    Shop Collection
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </Carousel>
    );
};

export default HeroCarousel;
