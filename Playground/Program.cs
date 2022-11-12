#region Generic math / Pattern matching

using System.Numerics;

var result = AddAll(new [] { 1, .2, 3, 4, 5 }.AsSpan());
Console.WriteLine(result);

T AddAll<T>(Span<T> values) where T : INumber<T> => values switch
{
    [] => T.Zero,
    [var first, .. var rest] => first + AddAll(rest),
};

#endregion

#region String literals

var s = """
    <element attr="content">
        <body>wow</body>
    </element>
""";

Console.WriteLine(s);

#endregion

#region Required properties

var person = new Person { FirstName = "John", LastName = "Doe" };
// Not allowed:
// person.LastName = "Foo";

[Person(FirstName = "Jane", LastName = "Doe")]

public class Person : Attribute
{
    public required string FirstName { get; init; }
    public string? MiddleName { get; init; }
    public required string LastName { get; init; }
}

#endregion
