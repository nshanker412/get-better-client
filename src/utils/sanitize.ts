


export  const sanitize = (text: string) =>  {

    const res = text.trim().replace(/(\r\n|\n|\r)/gm, " ")

return res
}
