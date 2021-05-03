import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Cropper from 'cropperjs'
import './ImageCropModal.css'
const ImageCropModal = (props) => {
    const handleClose = () => {
        // if user clicks outside of crop modal, assume they want to upload uncropped image:
        // set file input label as image filename
        props.bsCustomFileInput.init()
        props.setShow(false)
    }

    const handleCancel = () => {
        // if user clicks 'cancel', assume they want to clear their image from upload and reset
        // file input label to "upload recipe input" or "change photo"
        props.bsCustomFileInput.destroy()
        props.setImgForUpload()
        if (props.setUploadedImage) {
            props.setUploadedImage(false)
        }
        props.setShow(false)
    }

    if (props.show) {
        // keep/reset input label as "upload recipe input" / "change photo"
        // upon the appearance of this modal
        props.bsCustomFileInput.destroy()

        let img = document.querySelector('img')

        const initCropper = () => {
            try {
                const image = document.getElementById('imgforcrop')
                let cropper = new Cropper(image, {
                    viewMode: 3,
                    modal: true,
                    aspectRatio: 1 / 1,
                    initialAspectRatio: 1 / 1,
                    ready: () => {
                        document
                            .getElementById('crop_button')
                            .addEventListener('click', () => {
                                //export jpeg of cropped area
                                if (cropper.getCroppedCanvas().toDataURL()) {
                                    cropper
                                        .getCroppedCanvas()
                                        .toBlob((blob) => {
                                            let file = new File(
                                                [blob],
                                                'uploadimage.jpg',
                                                {
                                                    type: 'image/jpeg',
                                                    lastModified: Date.now()
                                                }
                                            )
                                            //set file input label to filename of cropped image
                                            //on crop
                                            props.bsCustomFileInput.init()
                                            props.setImgForUpload(file)
                                        })
                                }
                                cropper.destroy()
                                props.setShow(false)
                            })
                    }
                })
            } catch (e) {
                props.setImgForUpload()
                if (props.setUploadedImage) {
                    props.setUploadedImage(false)
                }
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
            <Modal
                centered
                show={props.show}
                onHide={handleClose}
                backdrop="static"
            >
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
                        <Button variant="secondary" onClick={handleCancel}>
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
