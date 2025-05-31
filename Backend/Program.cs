using System.Text;
using Amazon.S3;
using Backend.Config.Db;
using Backend.Domain.Entity;
using Backend.Middleware;
using Backend.Request;
using Backend.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

/*
 * 创建项目环节
 * 1. 使用命令`dotnet new sln -o sln目录`创建solution
 * 2. 使用命令`dotnet new webapi -o api目录 --use-controllers`创建api项目
 * 3. 使用命令`dotnet sln add api目录`将api项目加入到sln中
 *
 * 特殊文件
 * 1. `Properties/launchSettings.json`: 启动时的配置
 * 2. `api目录.csproj`: 依赖以及sdk的设置
 * 3. `appsettings.Development.json`,`appsettings.json`: 自己编写相应配置,类似spring boot的application.yml
 */

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// builder的Services这个区域是C#的依赖注入流程,依赖注入容器,在此区域中注入的顺序并不重要

// builder.Services.AddDbContext<StoreContext>(opt =>
// {
//     opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
// });
string connectionString;
if (builder.Environment.IsDevelopment())
{
    /*
     * 如果使用sqlite,字符串为`"Data source=文件名"`
     *
     * 迁移
     * 1. 修改entity
     * 2. 使用命令`dotnet ef migrations add 迁移标签`,创建相应的真实sql代码
     * 3. 使用命令`dotnet ef database update`,实际执行sql代码
     */
    connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
}
else
{
    // Use connection string provided at runtime by FlyIO.
    var connectionUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

    // Parse connection URL to connection string for Npgsql
    connectionUrl = connectionUrl.Replace("postgres://", string.Empty);
    var pgUserPass = connectionUrl.Split("@")[0];
    var pgHostPortDb = connectionUrl.Split("@")[1];
    var pgHostPort = pgHostPortDb.Split("/")[0];
    var pgDb = pgHostPortDb.Split("/")[1];
    var pgUser = pgUserPass.Split(":")[0];
    var pgPass = pgUserPass.Split(":")[1];
    var pgHost = pgHostPort.Split(":")[0];
    var pgPort = pgHostPort.Split(":")[1];

    connectionString = $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb};";
}

// 将DbContext注入到容器
builder.Services.AddDbContext<StoreContext>(opt => opt.UseNpgsql(connectionString));

// 注入所有的Controller
builder.Services.AddControllers();
builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(option =>
{
    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Description = "Put Bearer + your token in the box below",
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };

    option.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);
    // 这个类继承了字典,这个语句本质上是一个字典的集合初始化器
    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            jwtSecurityScheme, []
        }
    });
});

builder.Services.AddCors();
builder.Services.AddIdentityCore<User>(opt => { opt.User.RequireUniqueEmail = true; })
    .AddRoles<Role>()
    .AddEntityFrameworkStores<StoreContext>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey =
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWTSettings:TokenKey"]))
        };
    });
builder.Services.AddAuthorization();
/*
 * Singleton    应用启动时创建一次          整个应用程序周期内复用同一个实例
 * Scoped       每次请求开始时创建一次       在同一个请求中复用,同请求内同一个实例(一般用这个)
 * Transient    每次调用时都会创建一个新实例  始终是新建的实例(不推荐使用)
 */
// builder.Services.AddTransient<MyType>();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<PaymentService>();
// builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
// builder.Services.AddAWSService<IAmazonS3>(new AWSOptions
// {
//     Region = RegionEndpoint.EUWest2,
//     DefaultClientConfig = { ServiceURL = "http://localhost:9000" },
//     Credentials = new BasicAWSCredentials("minioadmin", "minioadmin")
// });
builder.Services.AddSingleton<IAmazonS3>(option =>
{
    var clientConfig = new AmazonS3Config
    {
        AuthenticationRegion = builder.Configuration["AWS:Region"],
        ServiceURL = builder.Configuration["AWS:ServiceUrl"],
        ForcePathStyle = true
    };

    return new AmazonS3Client(builder.Configuration["AWS:AccessKey"], builder.Configuration["AWS:SecretKey"],
        clientConfig);
});
builder.Services.AddScoped<FileService>();
builder.Services.AddScoped<ImageService>();

// app实际使用的功能(使用的middleware),在此区域中函数的调用顺序很重要(middleware的顺序)
var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();
if (app.Environment.IsDevelopment())
{
    // app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(opt => opt.ConfigObject.AdditionalItems.Add("persistAuthorization", "true"));
}

app.UseDefaultFiles();
// app.UseStaticFiles();
app.MapStaticAssets();

app.UseCors(opt => opt.AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()
    .WithOrigins("http://localhost:3000")
);

// 使用https
// app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

// 映射route到对应的controller和方法
app.MapControllers();
app.MapFallbackToController("Index", "Fallback");

// 创建scope获取容器中的组件
await using var scope = app.Services.CreateAsyncScope();
await using var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
using var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
try
{
    await context.Database.MigrateAsync();
    await DbInitializer.Initialize(context, userManager);
}
catch (Exception e)
{
    logger.LogError(e, "A problem occured during migration");
}

await app.RunAsync();