import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Cropper from 'cropperjs'
import './ImageCropModal.css'
const ImageCropModal = (props) => {
    const handleClose = () => props.setShow(false)

    if (props.show) {
        let img = document.querySelector('img')

        const initCropper = () => {
            try {
                const image = document.getElementById('imgforcrop')
                let cropper = new Cropper(image, {
                    viewMode: 3,
                    modal: true,
                    ready: () => {
                        document
                            .getElementById('crop_button')
                            .addEventListener('click', () => {
                                //export blob (binary image file) of cropped area
                                if (cropper.getCroppedCanvas().toDataURL()) {
                                    cropper
                                        .getCroppedCanvas()
                                        .toBlob((blob) =>
                                            props.setImgForUpload(blob)
                                        )
                                }
                                cropper.destroy()
                                handleClose()
                            })
                    }
                })
            } catch (e) {
                handleClose()
            }
        }
        const loaded = () => {
            if (props.show) {
                setTimeout(initCropper, 100)
            }
        }

        if (img.complete) {
            loaded()
        } else {
            img.addEventListener('load', loaded)
        }
    }
    return (
        <>
            <link
                href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.11/cropper.css"
                rel="stylesheet"
            />
            <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.11/cropper.js"></script>
            <Modal centered show={props.show} onHide={handleClose}>
                <Modal.Body className="imageCropModal">
                    <div className="imgforcropdiv">
                        <img
                            className="imgforcrop"
                            id="imgforcrop"
                            alt=""
                            src={props.imgsrc}
                        />
                    </div>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button id="crop_button" variant="info" type="submit">
                            Crop
                        </Button>
                    </Modal.Footer>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ImageCropModal
