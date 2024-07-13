import React from 'react';
import Slider from 'react-slick';
import WorkerCard from './WorkerCard';

const RecommendedWorkersSlider = ({ workers }) => {
  
    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        speed: 1000,
        swipeToSlide: true,
        autoplaySpeed: 2000,
        slidesToShow: 3,

        responsive : [
            {
                breakpoint: 992,
                settings:{
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                },
            },
            {
                breakpoint: 576,
                settings:{
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            }
        ]
    }

    return (
        <Slider {...settings}>
            {workers.map((worker) => (
                <div key={worker._id}>
                    <WorkerCard
                        name={worker.name}
                        designation={worker.designation || "N/A"}
                        skills={worker.skills.join(", ") || "N/A"}
                        experience={worker.years_of_experience || "N/A"}
                        pricePerHour={worker.hourly_rate || "N/A"}
                        location={worker.city || "N/A"}
                    />
                </div>
            ))}
        </Slider>
    );
};

export default RecommendedWorkersSlider;
