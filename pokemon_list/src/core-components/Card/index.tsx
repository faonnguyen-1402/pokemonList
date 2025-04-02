import Image from 'next/image';

import './styles.css';

interface CardProps {
  title: string;
  urlImage: string;
  width: number;
  height: number;
}

function Card({ title, urlImage, width, height }: CardProps) {
  return (
    <div className='pokemon'>
      <Image
        src={urlImage}
        title={title}
        width={width}
        height={height}
        alt={title}
      />
      <div className='card-text'> {title} </div>
    </div>
  );
}

export default Card;
