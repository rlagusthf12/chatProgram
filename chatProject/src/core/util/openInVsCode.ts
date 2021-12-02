export function openInVsCode(file: string | undefined) {
  if (file) {
    const localPath = (file.startsWith('@') ? file.replace('@/', '/vmerp/workspace/smarterp/app/src/') : file) + ':1:1'
    console.log('/__open-in-editor?file=' + encodeURIComponent(localPath));
    fetch('/__open-in-editor?file=' + encodeURIComponent(localPath))
  }
}