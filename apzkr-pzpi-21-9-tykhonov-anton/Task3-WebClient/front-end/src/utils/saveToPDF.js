import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Captures the content of a specified map container and saves it as a PDF file.
 *
 * @param {string} mapContainerId - The ID of the HTML element containing the map view to be saved.
 *
 * @example
 * // Usage example:
 * saveMapViewToPDF('mapContainerId');
 *
 * @throws Will log an error to the console if the map container with the specified ID is not found
 *         or if an error occurs during the PDF generation process.
 */
export const saveMapViewToPDF = (mapContainerId) => {
    // Get the map container element by its ID
    const mapContainer = document.getElementById(mapContainerId);

    // If the map container is not found, log an error and exit the function
    if (!mapContainer) {
        console.error('Map container not found');
        return;
    }

    // Capture the map container as a canvas using html2canvas
    html2canvas(mapContainer, { useCORS: true, allowTaint: false, foreignObjectRendering: false })
        .then(canvas => {
            // Convert the canvas to a PNG image data URL
            const imgData = canvas.toDataURL('image/png');

            // Create a new jsPDF document with landscape orientation, using A4 size
            const pdf = new jsPDF('l', 'mm', 'a4');

            // Get the dimensions of the PDF page
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Calculate the image dimensions, with a scaling factor to adjust the size
            const imgWidth = canvas.width * 0.75;
            const imgHeight = canvas.height * 0.75;

            // Calculate the scaling ratio to fit the image within the PDF dimensions
            const xRatio = pdfWidth / imgWidth;
            const yRatio = pdfHeight / imgHeight;
            const ratio = Math.min(xRatio, yRatio);

            // Calculate the new dimensions based on the scaling ratio
            const newImgWidth = imgWidth * ratio;
            const newImgHeight = imgHeight * ratio;

            // Add the image to the PDF, with the calculated dimensions
            pdf.addImage(imgData, 'PNG', 0, 0, newImgWidth, newImgHeight);

            // Save the PDF with the filename 'map-view.pdf'
            pdf.save('map-view.pdf');
        })
        .catch(error => {
            // Log any errors that occur during the PDF generation process
            console.error('Error generating PDF:', error);
        });
};


// Export the functions as part of the default export
export default {
  saveMapViewToPDF
};
