import React, {useEffect} from 'react';
import Swiper from "swiper";
import "swiper/css/swiper.css";
import {PlayArrow} from "@material-ui/icons";
import Box from "@material-ui/core/Box";

export default function Slider(props) {
    let slides = props.slides.filter(x => x.mime_type === 'video');
    slides = slides.concat(props.slides.filter(x => x.mime_type === 'image'));
    useEffect(() => {
        new Swiper('#' + props.id, {
            centeredSlides: true,
            loop: true,
            autoplay: {
                delay: 6000,
                disableOnInteraction: true,
            },

            pagination: {
                el: '.swiper-pagination',
                dynamicBullets: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }, [])

    const correctUrl = (str) => {
        let regexp = /(http|https):\/\/(\w+:?\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return regexp.test(str);
    }

    return (
        <Box
            id={props.id} className="swiper-container" style={props.style || {height: 200}}
        >
            <Box className="swiper-wrapper">
                {slides.map((slide, key) => {
                    if (slide.mime_type === 'image') {
                        return (
                            <Box
                                key={key} className="swiper-slide" style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            >
                                {correctUrl(slide.link) && slide.link
                                    ?
                                    <a
                                        href={correctUrl(slide.link) && slide.link}
                                        style={{width: '100%'}}
                                    >
                                        <img src={slide.image} alt={slide.title}
                                             style={{height: '100%', width: '100%'}}/>
                                    </a>
                                    :
                                    <a
                                        href={slide.image}
                                        data-fancybox={props.id}
                                        style={{width: '100%'}}
                                    >
                                        <img src={slide.image} alt={slide.title}
                                             style={{height: '100%', width: '100%'}}/>
                                    </a>
                                }
                            </Box>
                        )
                    }
                    if (slide.mime_type === 'video') {
                        return (
                            <div
                                key={key} className="swiper-slide" style={{
                                display: 'block'
                            }}
                            >
                                <a href={slide.video} data-fancybox={props.id}>
                                    <Box
                                        style={{
                                            position: 'absolute',
                                            height: '100%',
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: '#ffffff',
                                            pointerEvents: 'none'
                                        }}
                                    >
                                        <PlayArrow style={{fontSize: 60}} color="inherit"/>
                                    </Box>
                                    <video src={slide.video} style={{width: '100%'}}/>
                                </a>
                            </div>
                        )
                    }
                })
                }
            </Box>
            <div className="swiper-pagination"/>
            <div className="swiper-button-next swiper-button-white"></div>
            <div className="swiper-button-prev swiper-button-white"></div>
        </Box>
    )
}
