import { saveAs } from 'file-saver'

export const exportToPdf = async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId)
    if (!element) {
        console.error('Element not found for PDF export')
        return
    }

    // Dynamic import to avoid SSR "self is not defined" error
    // @ts-ignore
    const html2pdf = (await import('html2pdf.js')).default

    // Clone the element to manipulate styles without affecting the UI
    const clone = element.cloneNode(true) as HTMLElement

    // Helper to recursively apply computed styles (converting variables/oklch to rgb)
    const bakeComputedStyles = (original: HTMLElement, cloned: HTMLElement) => {
        const computed = window.getComputedStyle(original)

        // Explicitly set the RGB values to override classes/variables
        cloned.style.color = computed.color
        cloned.style.backgroundColor = computed.backgroundColor
        cloned.style.borderColor = computed.borderColor

        // Traverse children
        const children = original.children
        const clonedChildren = cloned.children

        for (let i = 0; i < children.length; i++) {
            if (children[i] instanceof HTMLElement && clonedChildren[i] instanceof HTMLElement) {
                bakeComputedStyles(children[i] as HTMLElement, clonedChildren[i] as HTMLElement)
            }
        }
    }

    // Bake the colors!
    bakeComputedStyles(element, clone)

    // Create a container to hold the clone (needs to be in DOM for html2canvas)
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.left = '-9999px'
    container.style.top = '0'
    // Force clean colors (hex/rgb) to avoid 'oklch' parsing errors in html2canvas
    container.style.setProperty('--background', '#ffffff')
    container.style.setProperty('--foreground', '#000000')
    container.style.setProperty('--muted', '#f3f4f6')
    container.style.setProperty('--muted-foreground', '#6b7280')
    container.style.setProperty('--border', '#e5e7eb')
    container.style.color = '#000000'
    container.style.background = '#ffffff'

    // Apply basic typography styles explicitly to the clone or container
    container.className = 'pdf-export-container'
    container.appendChild(clone)
    document.body.appendChild(container)

    const opt = {
        margin: 1,
        filename: `${filename}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const },
    }

    try {
        await html2pdf().set(opt).from(clone).save()
    } catch (error) {
        console.error('PDF Export failed:', error)
    } finally {
        if (document.body.contains(container)) {
            document.body.removeChild(container)
        }
    }
}

export const exportToDocx = async (htmlContent: string, filename: string) => {
    // Dynamic import to avoid SSR errors
    // @ts-ignore
    const { asBlob } = await import('html-docx-js-typescript')

    // Basic HTML wrapper for proper DOCX styling
    const wrappedHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>${filename}</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.5; color: #000000; }
                p { margin-bottom: 1em; }
                h1 { font-size: 24pt; font-weight: bold; margin-bottom: 0.5em; }
                h2 { font-size: 18pt; font-weight: bold; margin-bottom: 0.5em; }
                h3 { font-size: 14pt; font-weight: bold; margin-bottom: 0.5em; }
            </style>
        </head>
        <body>
            <h1>${filename}</h1>
            ${htmlContent}
        </body>
        </html>
    `

    asBlob(wrappedHtml).then((blob: Blob) => {
        saveAs(blob, `${filename}.docx`)
    })
}
