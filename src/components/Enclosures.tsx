export default function Enclosures(props: any) {
    const { enclosures } = props
    // const images = ['images', 'application/octet-stream'].some((el) => enclosures.filter((encl: any) => encl.mime_type.includes(el)))images
    const images = enclosures.filter((encl: any) => encl.mime_type.includes('image') || encl.mime_type.includes('application/octet-stream'))
    return (
        // {images ? images.map((encl: any) => (<img key={encl.id} src={encl.url} />)) : <div>Enclosures</div>}
        images.map((encl: any) => (<img key={encl.id} src={encl.url} />))
    )
}
