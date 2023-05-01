const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
/**
 * el prompt debe ser un arreglo
 * @param {{temas, genero, feeling }} prompt
 * @returns
 */
const songNameGenerator = async (prompt) => {
    const { letra, genero } = prompt;

    const respuesta =
        await `Dame el nombre de tres canciones a partir del significado de su letra, tomando en consideracion el genero musical para que me des nombres que se ajuste al promedio de nombres de canciones.
    
    Genero musical: Reggaeton
    Letra: El viento soba tu cabello Uh, uh, uh, uh, uh Me matan esos ojos bellos Uh, uh, uh, uh, uh Me gusta tu olor, de tu piel, el color Y como me haces sentir Me gusta tu boquita, ese labial rosita Y cómo me besas a mí Contigo quiero despertar Hacerlo después de fumar (ey) Ya no tengo na' que buscar Algo fuera de aquí Tú combinas con el mar Ese bikini se ve fenomenal No hay gravedad que me pueda elevar Me pones mal a mí Aceleraste mis latidos Es que me gusta todo de ti De to'as tus partes, ¿cuál decido? Es que me gusta todo de ti Es que me gusta todo de ti Es que me gusta todo de ti Quinta Avenida, no va pa'l mall Ella sabe que le llego a todo en un call En la Raptor me gusta ponerla en Ford El jogger large, la camisa small Como la dieta keto Por ti me controlo y me quedo quieto Aunque quiero comerte to' eso completo De ese culo me volví un teco, eh Micro dosis, rola, oxy Besando esos labios glossy Ya yo le di en to'as las posi' Shampoo de coco Chanel su wallet Me vuelve loco desde el casco Hasta los pedales Contigo quiero despertar Hacerlo después de fumar Ya no tengo na' que buscar Algo fuera de aquí Tú combinas con el mar Ese bikini se ve fenomenal No hay gravedad que me pueda elevar Me pones mal a mí Aceleraste mis latidos Es que me gusta todo de ti De to'as tus partes, ¿cuál decido? Es que me gusta todo de ti Todo de ti, todo de ti Es que me gusta todo de ti Todo de ti, todo de ti Es que me gusta todo de ti Contigo quiero despertar Hacerlo después de fumar Ya no tengo na' que buscar Algo fuera de aquí Tú combinas con el mar Ese bikini se ve fenomenal No hay gravedad que me pueda elevar Me pones mal a mí
    Nombre de Cancion: Todo de Ti
    
    Genero musical: Cumbia
    Letra: Me queda un porciento
    Y lo usaré solo para decirte lo mucho que lo siento
    Que si me ven con otra en una disco solo es perdiendo el tiempo
    Baby, ¿pa’ qué te miento?
    Eso de que me vieron feliz, no, no es cierto
    
    Ya nada me hace reír
    Solo cuando veo las fotos
    Y los vídeos que tengo de ti
    Salí con otra para olvidarte
    Y tenía el perfume que te gusta a ti
    
    Prendo para irme a dormir
    Porque duermo mejor si sueño que estás aquí
    Si supieras que te escribí
    No he mandado los mensajes, siguen todos ahí
    
    ¡Guau!
    Qué mucho me ha costa’o
    Quizás te hice un favor cuando me fui de tu lado
    Borracho, viendo tus fotos
    Me duele ver que tú sí has mejorado
    
    No tienes días grises
    Ya no te duelen las cicatrices
    Y yo pensando si decirte que
    
    Me queda un porciento
    Y lo usaré solo para decirte lo mucho que lo siento
    Que si me ven con otra en una disco solo es perdiendo el tiempo
    Baby, ¿pa’ qué te miento?
    Eso de que me vieron feliz, no, no es cierto
    
    Ey, hace tiempo no pensaba en ti
    Borracho, a tu Insta, me metí
    Baby, ya yo sé, que a ti te va bien
    Que de mí tú no quieres saber, ey, ey
    
    Viviendo en un infierno que yo mismo incendié
    Jugando contigo como si fuese el die’
    Siento que ya no estoy en tu corazón
    Ahora estoy en tus pie’
    
    Rogándote
    En el tequila, ahogándome
    Los muchacho’ están invitándome a salir
    La paso bien, pero siempre termino extrañándote
    
    En el tequila, ahogándome, ey
    Las morritas texteándome, ey
    Que dónde es la peda hoy, pero
    
    Me queda un porciento
    Y lo usaré solo para decirte lo mucho que lo siento
    Que si me ven con otra en una disco solo es perdiendo el tiempo
    Baby, ¿pa’ qué te miento?
    Eso de que me vieron feliz no es cierto, ey
    Nombre de Cancion: Un x100to
    
    Genero musical: ${genero}
    Letra: ${letra}
    Nombre de Cancion:`;

    const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: respuesta,
        temperature: 0.7,
        max_tokens: 100,
        n: 1,
        logprobs: null,
    });

    return response.data.choices[0].text;
};
module.exports = { songNameGenerator };
