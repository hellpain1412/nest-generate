## All Options:

   USAGE 

     index.js <name>

   ARGUMENTS

     <name>      Name of the model or module      required      

   OPTIONS

     -a                         Generate all (Module + Controller + Service + Interface + Schema)                                                          optional      default: false
     --all                      Generate all (Module + Controller + Service + Interface + Schema)                                                          optional      default: false
     -m                         Generate a Module                                                                                                          optional      default: false
     --module                   Generate a Module                                                                                                          optional      default: false
     --sch                      Generate a Schema for the model                                                                                            optional      default: false
     --schema                   Generate a Schema for the model                                                                                            optional      default: false
     --schema-class <name>      Specify a custom class name for the schema                                                                                 optional                    
     --schema-dir <dir>         Specify a subdirectory to put the Schema in (ie. 'schema')                                                                 optional                    
     -c                         Generate a Controller for the model                                                                                        optional      default: false
     --controller               Generate a Controller for the model                                                                                        optional      default: false
     -s                         Generate a Service for the model                                                                                           optional      default: false
     --service                  Generate a Service for the model                                                                                           optional      default: false
     -d                         Generate dtos for the model                                                                                                optional      default: false
     --dto                      Generate dtos for the model                                                                                                optional      default: false
     --crud                     Generates CRUD actions within the Controller and Service                                                                   optional      default: false
     -i                         Generate a Interface                                                                                                       optional      default: false
     --interface                Generate a Interface                                                                                                       optional      default: false
     --old                      Generate a Schema and interface for the model with old nest version                                                        optional      default: false
     -p <prefix>                Specify root/prefix dir to generate in                                                                                     optional                    
     --prefix <prefix>          Specify root/prefix dir to generate in                                                                                     optional                    
     --auth <name>              CRUD actions will add authentication guards, requiring a logged in user. Name of a custom @(Guard<name>) class to use      optional                    
     --no-subdir                Don't put generated files in <name> subdirectory (only if not using a module)                                              optional      default: false
     --casing <pascal>          default = "example.controller.ts", pascal = "ExampleController.ts"                                                         optional                    

   GLOBAL OPTIONS

     -h, --help         Display help                                      
     -V, --version      Display version                                   
     --no-color         Disable colors                                    
     --quiet            Quiet mode - only displays warn and error messages
     -v, --verbose      Verbose mode - will also output debug messages  