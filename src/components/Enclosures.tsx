import CarouselWithThumbs from "./customized/carousel/carousel-09"

export default function Enclosures(props: any) {
    const { enclosures } = props
    const images = enclosures.filter((encl: any) => encl.mime_type.includes('image') || encl.mime_type.includes('application/octet-stream'))
    return (
        // images.map((encl: any) => (<img key={encl.id} src={encl.url} />))
        <CarouselWithThumbs images={images} />
    )
}
